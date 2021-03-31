import { call, put, select } from 'redux-saga/effects';

import { messageBox } from "state/messagebox/actions";
import { normalizeUrl } from "util/url";
import {
    CONNECT_TO_HOME,
    connectedToHome,
    connectionToHomeFailed,
    HOME_OWNER_VERIFY,
    homeOwnerSet,
    homeOwnerVerified
} from "state/home/actions";
import { Naming, Node, NodeApiError, NodeName } from "api";
import { selectApi } from "api/node/call";
import { errorThrown } from "state/error/actions";
import { getHomeConnectionData, getHomeRootPage } from "state/home/selectors";
import { Browser } from "ui/browser";
import { askNaming } from "api/node/ask-naming";
import { executor } from "state/executor";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { now } from "util/misc";

export default [
    executor(CONNECT_TO_HOME, null, connectToHomeSaga),
    executor(HOME_OWNER_VERIFY, null, askNaming(verifyHomeOwnerSaga))
];

function* connectToHomeFailure(action, error) {
    const {location, login} = action.payload;

    yield put(connectionToHomeFailed());
    let message = error.message;
    if (error instanceof NodeApiError) {
        switch (error.errorCode) {
            case "credentials.wrong-reset-token":
                message = "Wrong secret code";
                console.log(message);
                break;
            case "credentials.reset-token-expired":
                message = "Secret code is expired";
                yield put(connectDialogSetForm(location, login, "forgot"));
                break;
            default:
                break;
        }
    }
    yield put(messageBox(message));
}

function* connectToHomeSaga(action) {
    const {location, assign, login, password, oldPassword, resetToken} = action.payload;

    let data;
    try {
        if (assign) {
            yield call(Node.createCredentials, location, login, password);
        } else if (oldPassword || resetToken) {
            yield call(Node.putCredentials, location, resetToken, oldPassword, login, password);
        }
        data = yield call(Node.createToken, location, login, password);
    } catch (e) {
        yield call(connectToHomeFailure, action, e);
        return;
    }

    let cartesData = {
        cartesIp: null,
        cartes: [],
        createdAt: 0
    };
    try {
        cartesData = yield call(Node.getCartes, location, data.token);
    } catch (e) {
        yield put(errorThrown(e));
    }

    const nodeUrl = normalizeUrl((yield call(selectApi, location)).rootLocation);
    Browser.storeConnectionData(nodeUrl, null, null, login, data.token, data.permissions);
    Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
    yield put(connectedToHome(nodeUrl, login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes, null, cartesData.createdAt - now()));
}

function* verifyHomeOwnerSaga() {
    try {
        const {nodeName, nodeNameChanging, fullName} = yield call(Node.getWhoAmI, ":");
        yield put(homeOwnerSet(nodeName, nodeNameChanging, fullName));

        const {location, login, token, permissions} = yield select(getHomeConnectionData);
        Browser.storeConnectionData(location, nodeName, fullName, login, token, permissions);

        const {name, generation} = NodeName.parse(nodeName);
        if (name == null) {
            return;
        }
        const ndata = yield call(Naming.getCurrent, name, generation);
        const rootPage = yield select(getHomeRootPage);
        const correct = ndata && normalizeUrl(ndata.nodeUri) === rootPage;
        yield put(homeOwnerVerified(nodeName, correct));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

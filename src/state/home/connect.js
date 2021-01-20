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
import { openConnectDialog } from "state/connectdialog/actions";
import { NameResolvingError, Naming, Node, NodeApiError, NodeName } from "api";
import { selectApi } from "api/node/call";
import { errorThrown } from "state/error/actions";
import { getHomeConnectionData, getHomeRootPage } from "state/home/selectors";
import { Browser } from "ui/browser";
import { askNaming } from "api/node/ask-naming";
import { executor } from "state/executor";

export default [
    executor(CONNECT_TO_HOME, null, connectToHomeSaga),
    executor(HOME_OWNER_VERIFY, null, askNaming(verifyHomeOwnerSaga))
];

function* connectToHomeFailure(error, onClose = null) {
    yield put(connectionToHomeFailed());
    yield put(messageBox("Connection to home failed: " + error.message, onClose));
}

function* connectToHomeSaga(action) {
    const {location, assign, login, password} = action.payload;
    let data;
    try {
        if (assign) {
            yield call(Node.createCredentials, location, login, password);
        }
        data = yield call(Node.createToken, location, login, password);
    } catch (e) {
        if (e instanceof NodeApiError || e instanceof NameResolvingError) {
            yield call(connectToHomeFailure, e, openConnectDialog());
        } else {
            yield call(connectToHomeFailure, e);
        }
        return;
    }

    let cartesData = {
        cartes: []
    };
    try {
        cartesData = yield call(Node.getCartes, location, data.token);
    } catch (e) {
        yield put(errorThrown(e));
    }

    const nodeUrl = normalizeUrl((yield call(selectApi, location)).rootLocation);
    Browser.storeConnectionData(nodeUrl, null, login, data.token, data.permissions);
    Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
    yield put(connectedToHome(nodeUrl, login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes));
}

function* verifyHomeOwnerSaga() {
    try {
        const {nodeName, nodeNameChanging} = yield call(Node.getWhoAmI, ":");
        yield put(homeOwnerSet(nodeName, nodeNameChanging));

        const {location, login, token, permissions} = yield select(getHomeConnectionData);
        Browser.storeConnectionData(location, nodeName, login, token, permissions);

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

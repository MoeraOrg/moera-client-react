import { call, put, select } from 'typed-redux-saga/macro';
import i18n from 'i18next';

import { messageBox } from "state/messagebox/actions";
import { normalizeUrl } from "util/url";
import {
    CONNECT_TO_HOME,
    connectedToHome,
    connectionToHomeFailed,
    ConnectToHomeAction,
    HOME_OWNER_VERIFY,
    homeOwnerSet,
    homeOwnerVerified
} from "state/home/actions";
import { Naming, Node, NodeApiError, NodeName } from "api";
import { selectApi } from "api/node/call";
import { errorThrown } from "state/error/actions";
import { getHomeConnectionData, getHomeRootLocation, getHomeRootPage } from "state/home/selectors";
import { executor } from "state/executor";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { CarteSet } from "api/node/api-types";
import { getCartes } from "api/node/cartes";
import { namingInitialized } from "state/init-selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";

export default [
    executor(CONNECT_TO_HOME, null, connectToHomeSaga),
    executor(HOME_OWNER_VERIFY, null, verifyHomeOwnerSaga, namingInitialized)
];

function* connectToHomeFailure(action: ConnectToHomeAction, error: any) {
    const {location, login} = action.payload;

    yield* put(connectionToHomeFailed());
    let message = typeof(error) === "string" ? error : error.message;
    if (error instanceof NodeApiError) {
        switch (error.errorCode) {
            case "credentials.wrong-reset-token":
                message = i18n.t("wrong-reset-token");
                break;
            case "credentials.reset-token-expired":
                message = i18n.t("reset-token-expired");
                yield* put(connectDialogSetForm(location, login, "forgot"));
                break;
            default:
                break;
        }
    }
    yield* put(messageBox(message));
}

function* connectToHomeSaga(action: ConnectToHomeAction) {
    const {location, assign, login, password, oldPassword, resetToken} = action.payload;

    let data;
    try {
        if (assign) {
            yield* call(Node.createCredentials, location, login, password);
        } else if (oldPassword || resetToken) {
            yield* call(Node.putCredentials, location, resetToken, oldPassword, login, password);
        }
        data = yield* call(Node.createToken, location, login, password, null);
    } catch (e) {
        yield* call(connectToHomeFailure, action, e);
        return;
    }

    let cartesData: CarteSet = {
        cartesIp: null,
        cartes: [],
        createdAt: 0
    };
    try {
        cartesData = yield* call(getCartes, location, data.token);
    } catch (e) {
        yield* put(errorThrown(e));
    }

    const nodeUrl = normalizeUrl((yield* call(selectApi, location)).rootLocation);
    if (nodeUrl == null) {
        yield* call(connectToHomeFailure, action, "Node URL not found");
        return;
    }
    Browser.storeConnectionData(nodeUrl, null, null, null, login, data.token, data.permissions);
    Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
    const homeLocation = yield* select(getHomeRootLocation);
    yield* put(connectedToHome(nodeUrl, login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes, null, cartesData.createdAt - now(), homeLocation != null && nodeUrl !== homeLocation));
}

function* verifyHomeOwnerSaga() {
    try {
        const {nodeName = null, nodeNameChanging, fullName = null, avatar = null} = yield* call(Node.getWhoAmI, ":");
        yield* put(homeOwnerSet(nodeName, nodeNameChanging ?? false, fullName, avatar));

        const {location, login, token, permissions} = yield* select(getHomeConnectionData);
        if (location != null) {
            Browser.storeConnectionData(location, nodeName, fullName, avatar, login, token, permissions);
        }

        if (nodeName == null) {
            return;
        }
        const {name, generation} = NodeName.parse(nodeName);
        if (name == null) {
            return;
        }
        const ndata = yield* call(Naming.getCurrent, name, generation);
        const rootPage = yield* select(getHomeRootPage);
        const correct = ndata != null && normalizeUrl(ndata.nodeUri) === rootPage;
        yield* put(homeOwnerVerified(nodeName, correct));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

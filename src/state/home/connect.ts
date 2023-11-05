import { call, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { Naming, Node, NodeApiError, NodeName, selectApi } from "api";
import { Storage } from "storage";
import { messageBox } from "state/messagebox/actions";
import {
    CONNECT_TO_HOME,
    connectedToHome,
    connectionToHomeFailed,
    ConnectToHomeAction,
    HOME_OWNER_VERIFY,
    homeOwnerSet,
    homeOwnerVerified
} from "state/home/actions";
import { errorThrown } from "state/error/actions";
import { getHomeConnectionData, getHomeRootLocation, getHomeRootPage } from "state/home/selectors";
import { executor } from "state/executor";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { normalizeUrl } from "util/url";

export default [
    executor(CONNECT_TO_HOME, null, connectToHomeSaga),
    executor(HOME_OWNER_VERIFY, null, homeOwnerVerifySaga)
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

    let info;
    try {
        if (assign) {
            yield* call(Node.createCredentials, location, {login, password}, ["credentials.already-created"]);
        } else if (oldPassword || resetToken) {
            yield* call(Node.updateCredentials, location, {resetToken, oldPassword, login, password},
                ["credentials.wrong-reset-token", "credentials.reset-token-expired", "credentials.login-incorrect"]);
        }
        info = yield* call(Node.createToken, location, {login, password},
            ["credentials.login-incorrect", "credentials.not-created"]);
    } catch (e) {
        yield* call(connectToHomeFailure, action, e);
        return;
    }

    const nodeUrl = normalizeUrl((yield* call(selectApi, location)).rootLocation);
    if (nodeUrl == null) {
        yield* call(connectToHomeFailure, action, "Node URL not found");
        return;
    }
    Storage.storeConnectionData(nodeUrl, null, null, null, login, info.token, info.permissions);
    const homeLocation = yield* select(getHomeRootLocation);
    yield* put(connectedToHome({
        location: nodeUrl,
        login,
        token: info.token,
        permissions: info.permissions,
        connectionSwitch: homeLocation != null && nodeUrl !== homeLocation
    }));
}

function* homeOwnerVerifySaga() {
    try {
        const {nodeName = null, nodeNameChanging, fullName = null, avatar = null} = yield* call(Node.whoAmI, ":");
        yield* put(homeOwnerSet(nodeName, nodeNameChanging ?? false, fullName, avatar));

        const {location, login, token, permissions} = yield* select(getHomeConnectionData);
        if (location != null) {
            Storage.storeConnectionData(location, nodeName, fullName, avatar, login, token, permissions);
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

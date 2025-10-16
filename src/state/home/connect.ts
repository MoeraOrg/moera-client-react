import i18n from 'i18next';

import { Node, NodeApiError, selectApi } from "api";
import { Storage } from "storage";
import { getNodeUri } from "state/naming/sagas";
import { messageBox } from "state/messagebox/actions";
import {
    connectionToHomeFailed,
    ConnectToHomeAction,
    homeOwnerSet,
    homeOwnerVerified,
    HomeOwnerVerifyAction
} from "state/home/actions";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { getHomeConnectionData, getHomeRootPage } from "state/home/selectors";
import { isAtNode } from "state/node/selectors";
import { boot } from "state/navigation/actions";
import { executor } from "state/executor";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { normalizeUrl } from "util/url";
import { REL_HOME } from "util/rel-node-name";
import { toDocumentLocation } from "util/universal-url";

export default [
    executor("CONNECT_TO_HOME", null, connectToHomeSaga),
    executor("HOME_OWNER_VERIFY", null, homeOwnerVerifySaga)
];

function connectToHomeFailure(action: WithContext<ConnectToHomeAction>, error: any): void {
    const {location, login} = action.payload;

    dispatch(connectionToHomeFailed().causedBy(action));
    let message = typeof(error) === "string" ? error : error.message;
    if (error instanceof NodeApiError) {
        switch (error.errorCode) {
            case "credentials.wrong-reset-token":
                message = i18n.t("wrong-reset-token");
                break;
            case "credentials.reset-token-expired":
                message = i18n.t("reset-token-expired");
                dispatch(connectDialogSetForm(location, login, "forgot").causedBy(action));
                break;
            case "credentials.login-incorrect":
                message = i18n.t("login-incorrect");
                break;
            default:
                break;
        }
    }
    dispatch(messageBox(message).causedBy(action));
}

async function connectToHomeSaga(action: WithContext<ConnectToHomeAction>): Promise<void> {
    const {location, assign, login, password, oldPassword, resetToken} = action.payload;

    let info;
    try {
        if (assign) {
            await Node.createCredentials(action, location, {login, password}, ["credentials.already-created"]);
        } else if (oldPassword || resetToken) {
            await Node.updateCredentials(
                action, location, {token: resetToken, oldPassword, login, password},
                ["credentials.wrong-reset-token", "credentials.reset-token-expired", "credentials.login-incorrect"]
            );
        }
        info = await Node.createToken(
            action, location, {login, password}, ["credentials.login-incorrect", "credentials.not-created"]
        );
    } catch (e) {
        connectToHomeFailure(action, e);
        return;
    }

    const nodeUrl = normalizeUrl((await selectApi(action, location)).rootLocation);
    if (nodeUrl == null) {
        connectToHomeFailure(action, "Node URL not found");
        return;
    }
    Storage.storeConnectionData(nodeUrl, null, null, null, login, info.token, info.permissions);
    const atNode = select(isAtNode);
    const backHref = select(state => state.connectDialog.backHref);
    dispatch(boot(!atNode || !backHref ? {} : toDocumentLocation({href: backHref})));
}

async function homeOwnerVerifySaga(action: WithContext<HomeOwnerVerifyAction>): Promise<void> {
    try {
        const {nodeName = null, nodeNameChanging, fullName = null, avatar = null} = await Node.whoAmI(action, REL_HOME);
        dispatch(homeOwnerSet(nodeName, nodeNameChanging ?? false, fullName, avatar).causedBy(action));

        const {
            connection: {location, login, token, permissions},
            homeRootPage
        } = select(state => ({
            connection: getHomeConnectionData(state),
            homeRootPage: getHomeRootPage(state)
        }));
        if (location != null) {
            Storage.storeConnectionData(location, nodeName, fullName, avatar, login, token, permissions);
        }

        if (nodeName == null) {
            return;
        }
        const nodeUri = normalizeUrl(await getNodeUri(action, nodeName));
        const correct = normalizeUrl(nodeUri) === homeRootPage;
        dispatch(homeOwnerVerified(nodeName, correct).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

import { call, select } from 'redux-saga/effects';

import { Node, NodeApi } from "api";
import { urlWithParameters } from "util/misc";
import { ClientSettings, HomeNotConnectedError } from "api";
import { getHomeToken, isConnectedToHome } from "state/home/selectors";

function* callHome(options) {
    return yield call(Node.callApi, {
        rootApiSelector: state => state.home.root.api,
        ...options,
        errorTitle: "Home access error"
    });
}

export function* authorized(location, token = null) {
    if (token == null && !(yield select(isConnectedToHome))) {
        throw new HomeNotConnectedError();
    }
    token = token != null ? token : yield select(getHomeToken);
    return urlWithParameters(location, {token});
}

export function* createCredentials(rootApi, login, password) {
    yield call(callHome, {
        location: "/credentials",
        rootApiSelector: rootApi,
        method: "POST",
        body: {
            login,
            password
        },
        schema: NodeApi.Result,
        errorFilter: ["credentials.already-created"]
    });
}

export function* createToken(rootApi, login, password) {
    return yield call(callHome, {
        location: "/tokens",
        rootApiSelector: rootApi,
        method: "POST",
        body: {
            login,
            password
        },
        schema: NodeApi.TokenCreated,
        errorFilter: ["credentials.login-incorrect", "credentials.not-created"]
    });
}

export function* getWhoAmI() {
    return yield call(callHome, {location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getNodeSettings() {
    const location = yield call(authorized, "/settings/node");
    return yield call(callHome, {location, schema: NodeApi.SettingInfoArray});
}

export function* getNodeSettingsMetadata() {
    const location = yield call(authorized, "/settings/node/metadata");
    return yield call(callHome, {location, schema: NodeApi.SettingMetaInfoArray});
}

export function* getClientSettings() {
    const location = yield call(authorized,
        urlWithParameters("/settings/client", {prefix: ClientSettings.PREFIX}));
    return yield call(callHome, {location, schema: NodeApi.SettingInfoArray});
}

export function* putSettings(settings) {
    const location = yield call(authorized, "/settings");
    return yield call(callHome, {location, method: "PUT", body: settings, schema: NodeApi.Result});
}

export function* remotePostingVerify(nodeName, id) {
    const location = yield call(authorized, `/nodes/${nodeName}/postings/${id}/verify`);
    return yield call(callHome, {location, method: "POST", schema: NodeApi.AsyncOperationCreated});
}

export function* getCartes(rootApi = null, token = null) {
    if (rootApi != null) {
        const location = yield call(authorized, "/cartes", token);
        return yield call(callHome, {location, rootApiSelector: rootApi, schema: NodeApi.CarteSet});
    } else {
        const location = yield call(authorized, "/cartes");
        return yield call(callHome, {location, schema: NodeApi.CarteSet});
    }
}

export function* postRemoteReaction(nodeName, postingId, negative, emoji) {
    const location = yield call(authorized, `/nodes/${nodeName}/postings/${postingId}/reactions`);
    return yield call(callHome, {location, method: "POST", body: {negative, emoji}, schema: NodeApi.Result});
}

export function* remoteReactionVerify(nodeName, postingId, ownerName) {
    const location = yield call(authorized,
        `/nodes/${nodeName}/postings/${postingId}/reactions/${ownerName}/verify`);
    return yield call(callHome, {location, method: "POST", schema: NodeApi.AsyncOperationCreated});
}

export function* getDraftPostings() {
    const location = yield call(authorized, `/draft-postings`);
    return yield call(callHome, {location, schema: NodeApi.PostingInfoList});
}

export function* getDraftPosting(id) {
    const location = yield call(authorized, `/draft-postings/${id}`);
    return yield call(callHome, {
        location, schema: NodeApi.PostingInfo, withBodies: true, errorFilter: ["posting.not-found"]
    });
}

export function* postDraftPosting(postingText) {
    const location = yield call(authorized, "/draft-postings");
    return yield call(callHome, {
        location, method: "POST", body: postingText, schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* putDraftPosting(id, postingText) {
    const location = yield call(authorized, `/draft-postings/${id}`);
    return yield call(callHome, {
        location, method: "PUT", body: postingText, schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deleteDraftPosting(id) {
    const location = yield call(authorized, `/draft-postings/${id}`);
    return yield call(callHome, {location, method: "DELETE", schema: NodeApi.Result});
}

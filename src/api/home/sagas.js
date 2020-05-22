import { call } from 'redux-saga/effects';

import { ClientSettings, NodeApi } from "api";
import { callApi } from "api/node/call";
import { urlWithParameters } from "util/misc";

export function* createCredentials(nodeName, login, password) {
    yield call(callApi, {
        nodeName,
        location: "/credentials",
        method: "POST",
        body: {
            login,
            password
        },
        schema: NodeApi.Result,
        errorFilter: ["credentials.already-created"]
    });
}

export function* createToken(nodeName, login, password) {
    return yield call(callApi, {
        nodeName,
        location: "/tokens",
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
    return yield call(callApi, {nodeName: ":", location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getNodeSettings() {
    return yield call(callApi, {
        nodeName: ":", location: "/settings/node", auth: true, schema: NodeApi.SettingInfoArray
    });
}

export function* getNodeSettingsMetadata() {
    return yield call(callApi, {
        nodeName: ":", location: "/settings/node/metadata", auth: true, schema: NodeApi.SettingMetaInfoArray
    });
}

export function* getClientSettings() {
    const location = urlWithParameters("/settings/client", {prefix: ClientSettings.PREFIX});
    return yield call(callApi, {nodeName: ":", location, auth: true, schema: NodeApi.SettingInfoArray});
}

export function* putSettings(settings) {
    return yield call(callApi, {
        nodeName: ":", location: "/settings", method: "PUT", auth: true, body: settings, schema: NodeApi.Result
    });
}

export function* remotePostingVerify(nodeName, id) {
    return yield call(callApi, {
        nodeName: ":", location: `/nodes/${nodeName}/postings/${id}/verify`, method: "POST", auth: true,
        schema: NodeApi.AsyncOperationCreated
    });
}

export function* getCartes(nodeName = ":", auth = true) {
    return yield call(callApi, {nodeName, location: "/cartes", auth, schema: NodeApi.CarteSet});
}

export function* postRemoteReaction(remoteNodeName, postingId, negative, emoji) {
    return yield call(callApi, {
        nodeName: ":", location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions`, method: "POST", auth: true,
        body: {negative, emoji}, schema: NodeApi.Result
    });
}

export function* remoteReactionVerify(remoteNodeName, postingId, ownerName) {
    return yield call(callApi, {
        nodeName: ":", location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`,
        method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* getDraftPostings() {
    return yield call(callApi, {
        nodeName: ":", location: "/draft-postings", auth: true, schema: NodeApi.PostingInfoList
    });
}

export function* getDraftPosting(id) {
    return yield call(callApi, {
        nodeName: ":", location: `/draft-postings/${id}`, auth: true, schema: NodeApi.PostingInfo, withBodies: true,
        errorFilter: ["posting.not-found"]
    });
}

export function* postDraftPosting(postingText) {
    return yield call(callApi, {
        nodeName: ":", location: "/draft-postings", method: "POST", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* putDraftPosting(id, postingText) {
    return yield call(callApi, {
        nodeName: ":", location: `/draft-postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deleteDraftPosting(id) {
    return yield call(callApi, {
        nodeName: ":", location: `/draft-postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* getFeedStatus(feedName) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {
        nodeName: ":", location: `/feeds/${feedName}/status`, auth: true, schema: NodeApi.FeedStatus
    });
}

export function* putFeedStatus(feedName, viewed, read, before) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {
        nodeName: ":", location: `/feeds/${feedName}/status`, method: "PUT", auth: true, body: {viewed, read, before},
        schema: NodeApi.FeedStatus
    });
}

export function* getFeedSlice(feedName, after, before, limit) {
    feedName = encodeURIComponent(feedName);
    const location = urlWithParameters(`/feeds/${feedName}/stories`, {after, before, limit});
    return yield call(callApi, {
        nodeName: ":", location, auth: true, schema: NodeApi.FeedSliceInfo, withBodies: true
    });
}

export function* putStory(id, storyAttributes) {
    return yield call(callApi, {
        nodeName: ":", location: `/stories/${id}`, method: "PUT", auth: true, body: storyAttributes,
        schema: NodeApi.StoryInfo, withBodies: true
    });
}

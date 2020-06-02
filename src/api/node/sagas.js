import { call, select } from 'redux-saga/effects';

import { ClientSettings, NodeApi } from "api";
import { callApi } from "api/node/call";
import { getHomeOwnerName } from "state/home/selectors";
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

export function* getCartes(nodeName, auth = true) {
    return yield call(callApi, {nodeName, location: "/cartes", auth, schema: NodeApi.CarteSet});
}

export function* getWhoAmI(nodeName) {
    return yield call(callApi, {nodeName, location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getNodeSettings(nodeName) {
    return yield call(callApi, {
        nodeName, location: "/settings/node", auth: true, schema: NodeApi.SettingInfoArray
    });
}

export function* getNodeSettingsMetadata(nodeName) {
    return yield call(callApi, {
        nodeName, location: "/settings/node/metadata", auth: true, schema: NodeApi.SettingMetaInfoArray
    });
}

export function* getClientSettings(nodeName) {
    const location = urlWithParameters("/settings/client", {prefix: ClientSettings.PREFIX});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.SettingInfoArray});
}

export function* putSettings(nodeName, settings) {
    return yield call(callApi, {
        nodeName, location: "/settings", method: "PUT", auth: true, body: settings, schema: NodeApi.Result
    });
}

export function* getProfile(nodeName) {
    return yield call(callApi, {nodeName, location: "/profile", auth: true, schema: NodeApi.ProfileInfo});
}

export function* putProfile(nodeName, profile) {
    return yield call(callApi, {
        nodeName, location: "/profile", method: "PUT", auth: true, body: profile, schema: NodeApi.ProfileInfo
    });
}

export function* getNodeName(nodeName) {
    return yield call(callApi, {nodeName, location: "/node-name", auth: true, schema: NodeApi.NodeNameInfo});
}

export function* registerName(nodeName, name) {
    return yield call(callApi, {
        nodeName, location: "/node-name", method: "POST", auth: true, body: {name}, schema: NodeApi.RegisteredNameSecret
    });
}

export function* updateNodeName(nodeName, name, mnemonic) {
    const body = name ? {name, mnemonic} : {mnemonic};
    return yield call(callApi, {
        nodeName, location: "/node-name", method: "PUT", auth: true, body, schema: NodeApi.Result
    });
}

export function* getFeedGeneral(nodeName, feedName) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {nodeName, location: `/feeds/${feedName}`, auth: true, schema: NodeApi.FeedInfo});
}

export function* getFeedSlice(nodeName, feedName, after, before, limit) {
    feedName = encodeURIComponent(feedName);
    const location = urlWithParameters(`/feeds/${feedName}/stories`, {after, before, limit});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.FeedSliceInfo, withBodies: true});
}

export function* getFeedStatus(nodeName, feedName) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {
        nodeName, location: `/feeds/${feedName}/status`, auth: true, schema: NodeApi.FeedStatus
    });
}

export function* putFeedStatus(nodeName, feedName, viewed, read, before) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {
        nodeName, location: `/feeds/${feedName}/status`, method: "PUT", auth: true, body: {viewed, read, before},
        schema: NodeApi.FeedStatus
    });
}

export function* putStory(nodeName, id, storyAttributes) {
    return yield call(callApi, {
        nodeName, location: `/stories/${id}`, method: "PUT", auth: true, body: storyAttributes,
        schema: NodeApi.StoryInfo, withBodies: true
    });
}

export function* postSubscriber(nodeName, feedName) {
    return yield call(callApi, {
        nodeName, location: "/subscribers", method: "POST", auth: true, body: {type: "feed", feedName},
        schema: NodeApi.SubscriberInfo
    });
}

export function* postSubscription(nodeName, remoteSubscriberId, remoteNodeName, remoteFeedName) {
    return yield call(callApi, {
        nodeName, location: "/subscriptions", method: "POST", auth: true,
        body: {type: "feed", remoteSubscriberId, remoteNodeName, remoteFeedName}, schema: NodeApi.SubscriptionInfo
    });
}

export function* getPostingFeatures(nodeName) {
    return yield call(callApi, {nodeName, location: "/postings/features", schema: NodeApi.PostingFeatures});
}

export function* getPosting(nodeName, id, withSource = false) {
    const include = withSource ? "source" : null;
    const location = urlWithParameters(`/postings/${id}`, {include});
    return yield call(callApi, {
        nodeName, location, auth: true, schema: NodeApi.PostingInfo, withBodies: true,
        errorFilter: ["posting.not-found"]
    });
}

export function* postPosting(nodeName, postingText) {
    return yield call(callApi, {
        nodeName, location: "/postings", method: "POST", auth: true, body: postingText, schema: NodeApi.PostingInfo,
        withBodies: true
    });
}

export function* putPosting(nodeName, id, postingText) {
    return yield call(callApi, {
        nodeName, location: `/postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePosting(nodeName, id) {
    return yield call(callApi, {
        nodeName, location: `/postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* remotePostingVerify(nodeName, remoteNodeName, id) {
    return yield call(callApi, {
        nodeName: ":", location: `/nodes/${remoteNodeName}/postings/${id}/verify`, method: "POST", auth: true,
        schema: NodeApi.AsyncOperationCreated
    });
}

export function* postReaction(nodeName, postingId, negative, emoji) {
    const ownerName = yield select(getHomeOwnerName);
    const body = {ownerName, negative, emoji};
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reactions`, method: "POST", auth: true, body,
        schema: NodeApi.ReactionCreated
    });
}

export function* getReaction(nodeName, postingId) {
    const ownerName = yield select(getHomeOwnerName);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reactions/${ownerName}`, auth: true, schema: NodeApi.ReactionInfo
    });
}

export function* deleteReaction(nodeName, postingId) {
    const ownerName = yield select(getHomeOwnerName);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reactions/${ownerName}`, method: "DELETE", auth: true,
        schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getReactionTotals(nodeName, postingId) {
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reaction-totals`, auth: true, schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getReactions(nodeName, postingId, negative, emoji, before, limit) {
    const location = urlWithParameters(`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.ReactionsSliceInfo});
}

export function* postRemoteReaction(nodeName, remoteNodeName, postingId, negative, emoji) {
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions`, method: "POST", auth: true,
        body: {negative, emoji}, schema: NodeApi.Result
    });
}

export function* remoteReactionVerify(nodeName, remoteNodeName, postingId, ownerName) {
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`,
        method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* getDraftPostings(nodeName) {
    return yield call(callApi, {
        nodeName, location: "/draft-postings", auth: true, schema: NodeApi.PostingInfoList
    });
}

export function* getDraftPosting(nodeName, id) {
    return yield call(callApi, {
        nodeName, location: `/draft-postings/${id}`, auth: true, schema: NodeApi.PostingInfo, withBodies: true,
        errorFilter: ["posting.not-found"]
    });
}

export function* postDraftPosting(nodeName, postingText) {
    return yield call(callApi, {
        nodeName, location: "/draft-postings", method: "POST", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* putDraftPosting(nodeName, id, postingText) {
    return yield call(callApi, {
        nodeName, location: `/draft-postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deleteDraftPosting(nodeName, id) {
    return yield call(callApi, {
        nodeName, location: `/draft-postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* getPostingDraftRevision(nodeName, id) {
    return yield call(callApi, {
        nodeName, location: `/postings/${id}/revisions/draft`, auth: true, schema: NodeApi.PostingInfo,
        withBodies: true, errorFilter: ["posting.not-found"]
    });
}

export function* putPostingDraftRevision(nodeName, id, postingText) {
    return yield call(callApi, {
        nodeName, location: `/postings/${id}/revisions/draft`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePostingDraftRevision(nodeName, id) {
    return yield call(callApi, {
        nodeName, location: `/postings/${id}/revisions/draft`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

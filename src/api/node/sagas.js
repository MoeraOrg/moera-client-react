import { call, select } from 'redux-saga/effects';

import { NodeApi } from "api";
import { callApi } from "api/node/call";
import { getHomeOwnerName } from "state/home/selectors";
import { urlWithParameters } from "util/misc";

export function* getWhoAmI() {
    return yield call(callApi, {location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getProfile() {
    return yield call(callApi, {location: "/profile", auth: true, schema: NodeApi.ProfileInfo});
}

export function* putProfile(profile) {
    return yield call(callApi, {
        location: "/profile", method: "PUT", auth: true, body: profile, schema: NodeApi.ProfileInfo
    });
}

export function* getNodeName() {
    return yield call(callApi, {location: "/node-name", auth: true, schema: NodeApi.NodeNameInfo});
}

export function* registerName(name) {
    return yield call(callApi, {
        location: "/node-name", method: "POST", auth: true, body: {name}, schema: NodeApi.RegisteredNameSecret
    });
}

export function* updateNodeName(name, mnemonic) {
    const body = name ? {name, mnemonic} : {mnemonic};
    return yield call(callApi, {location: "/node-name", method: "PUT", auth: true, body, schema: NodeApi.Result});
}

export function* getFeedGeneral(feedName) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {location: `/feeds/${feedName}`, schema: NodeApi.FeedInfo});
}

export function* getFeedSlice(feedName, after, before, limit) {
    feedName = encodeURIComponent(feedName);
    const location = urlWithParameters(`/feeds/${feedName}/stories`, {after, before, limit});
    return yield call(callApi, {location, auth: true, schema: NodeApi.FeedSliceInfo, withBodies: true});
}

export function* getPostingFeatures() {
    return yield call(callApi, {location: "/postings/features", schema: NodeApi.PostingFeatures});
}

export function* getPosting(id, withSource = false) {
    const include = withSource ? "source" : null;
    const location = urlWithParameters(`/postings/${id}`, {include});
    return yield call(callApi, {
        location, auth: true, schema: NodeApi.PostingInfo, withBodies: true, errorFilter: ["posting.not-found"]
    });
}

export function* postPosting(postingText) {
    return yield call(callApi, {
        location: "/postings", method: "POST", auth: true, body: postingText, schema: NodeApi.PostingInfo,
        withBodies: true
    });
}

export function* putPosting(id, postingText) {
    return yield call(callApi, {
        location: `/postings/${id}`, method: "PUT", auth: true, body: postingText, schema: NodeApi.PostingInfo,
        withBodies: true
    });
}

export function* deletePosting(id) {
    return yield call(callApi, {
        location: `/postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* postReaction(postingId, negative, emoji) {
    const ownerName = yield select(getHomeOwnerName);
    const body = {ownerName, negative, emoji};
    return yield call(callApi, {
        location: `/postings/${postingId}/reactions`, method: "POST", auth: true, body, schema: NodeApi.ReactionCreated
    });
}

export function* getReaction(postingId) {
    const ownerName = yield select(getHomeOwnerName);
    return yield call(callApi, {
        location: `/postings/${postingId}/reactions/${ownerName}`, auth: true, schema: NodeApi.ReactionInfo
    });
}

export function* deleteReaction(postingId) {
    const ownerName = yield select(getHomeOwnerName);
    return yield call(callApi, {
        location: `/postings/${postingId}/reactions/${ownerName}`, method: "DELETE", auth: true,
        schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getReactionTotals(postingId) {
    return yield call(callApi, {
        location: `/postings/${postingId}/reaction-totals`, auth: true, schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getReactions(postingId, negative, emoji, before, limit) {
    const location = urlWithParameters(`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit});
    return yield call(callApi, {location, auth: true, schema: NodeApi.ReactionsSliceInfo});
}

export function* getPostingDraftRevision(id) {
    return yield call(callApi, {
        location: `/postings/${id}/revisions/draft`, auth: true, schema: NodeApi.PostingInfo, withBodies: true,
        errorFilter: ["posting.not-found"]
    });
}

export function* putPostingDraftRevision(id, postingText) {
    return yield call(callApi, {
        location: `/postings/${id}/revisions/draft`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePostingDraftRevision(id) {
    return yield call(callApi, {
        location: `/postings/${id}/revisions/draft`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* putStory(id, storyAttributes) {
    return yield call(callApi, {
        location: `/stories/${id}`, method: "PUT", auth: true, body: storyAttributes, schema: NodeApi.StoryInfo,
        withBodies: true
    });
}

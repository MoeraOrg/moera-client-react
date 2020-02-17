import { apply, call, put, select } from 'redux-saga/effects';

import { Browser, formatSchemaErrors, NodeApi, NodeApiError, NodeError } from "api";
import { getNodeToken } from "state/node/selectors";
import { getCurrentCarte } from "state/cartes/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { errorAuthInvalid } from "state/error/actions";
import { urlWithParameters } from "util/misc";

function apiUrl(rootApi, location, method) {
    if (["POST", "PUT", "DELETE"].includes(method)) {
        return urlWithParameters(rootApi + location, {"cid": Browser.clientId});
    } else {
        return rootApi + location;
    }
}

function isErrorCodeAllowed(errorCode, filter) {
    if (typeof filter === "boolean") {
        return filter;
    }
    if (Array.isArray(filter)) {
        return filter.map(c => c.toLowerCase()).includes(errorCode.toLowerCase());
    }
    if (typeof filter === "function") {
        return filter(errorCode);
    }
    return false;
}

export function* callApi({
            location,
            rootApiSelector,
            method = "GET",
            body = null,
            schema = null,
            withBodies = false,
            errorTitle = "",
            errorFilter = false
        }) {
    const rootApi = typeof rootApiSelector === "string" ? rootApiSelector : (yield select(rootApiSelector));
    const exception = (e, details) => new NodeError(method, rootApi, location, errorTitle, e, details);
    let response;
    try {
        response = yield call(fetch, apiUrl(rootApi, location, method), {
            method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: body != null ? JSON.stringify(body) : null
        });
    } catch (e) {
        throw exception(e);
    }
    let data;
    try {
        data = yield apply(response, response.json);
    } catch (e) {
        if (!response.ok) {
            throw exception("Server returned error status");
        } else {
            if (schema) {
                throw exception("Server returned empty result");
            } else {
                return {};
            }
        }
    }
    if (!response.ok) {
        if (!NodeApi.Result(data)) {
            throw exception("Server returned error status");
        }
        if (data.errorCode === "authentication.invalid") {
            yield put(errorAuthInvalid());
            throw new NodeApiError(data.errorCode, data.message);
        }
        if (isErrorCodeAllowed(data.errorCode, errorFilter)) {
            throw new NodeApiError(data.errorCode, data.message);
        } else {
            throw exception("Server returned error status: " + data.message);
        }
    }
    if (schema && !schema(data)) {
        throw exception("Server returned incorrect response", formatSchemaErrors(schema.errors));
    }
    if (withBodies) {
        data = decodeBodies(data, exception);
    }
    return data;
}

function* callNode(options) {
    return yield call(callApi, {
        ...options,
        rootApiSelector: state => state.node.root.api,
        errorTitle: "Node access error"
    });
}

function decodeBody(encoded, exception) {
    let body = JSON.parse(encoded);
    if (!NodeApi.Body(body)) {
        throw exception("Server returned incorrect response", formatSchemaErrors(NodeApi.Body.errors));
    }
    return body;
}

function decodeBodies(data, exception) {
    let decoded = {...data};
    if (data.postings) {
        decoded.postings = data.postings.map(p => decodeBodies(p, exception));
    }
    if (data.body) {
        decoded.body = decodeBody(data.body, exception);
    }
    if (data.bodyPreview) {
        decoded.bodyPreview = decodeBody(data.bodyPreview, exception);
    }
    if (data.bodySrc) {
        decoded.bodySrc = decodeBody(data.bodySrc, exception);
    }
    return decoded;
}

function* authorized(location) {
    const token = yield select(getNodeToken);
    return urlWithParameters(location, {token});
}

function* introduced(location) {
    const token = yield select(getNodeToken);
    const carte = token == null ? yield select(getCurrentCarte) : null;
    return urlWithParameters(location, {token, carte});
}

export function* getWhoAmI() {
    return yield call(callNode, {location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getProfile() {
    const location = yield call(authorized, "/profile");
    return yield call(callNode, {location, schema: NodeApi.ProfileInfo});
}

export function* putProfile(profile) {
    const location = yield call(authorized, "/profile");
    return yield call(callNode, {location, method: "PUT", body: profile, schema: NodeApi.ProfileInfo});
}

export function* getNodeName() {
    const location = yield call(authorized, "/node-name");
    return yield call(callNode, {location, schema: NodeApi.NodeNameInfo});
}

export function* registerName(name) {
    const location = yield call(authorized, "/node-name");
    return yield call(callNode, {location, method: "POST", body: {name}, schema: NodeApi.RegisteredNameSecret});
}

export function* updateNodeName(name, mnemonic) {
    const location = yield call(authorized, "/node-name");
    const body = name ? {name, mnemonic} : {mnemonic};
    return yield call(callNode, {location, method: "PUT", body, schema: NodeApi.Result});
}

export function* getTimelineGeneral() {
    return yield call(callNode, {location: "/timeline", schema: NodeApi.TimelineInfo});
}

export function* getTimelineSlice(after, before, limit) {
    const location = yield call(introduced,
        urlWithParameters("/timeline/postings", {after, before, limit}));
    return yield call(callNode, {location, schema: NodeApi.TimelineSliceInfo, withBodies: true});
}

export function* getPostingFeatures() {
    return yield call(callNode, {location: "/postings/features", schema: NodeApi.PostingFeatures});
}

export function* getPosting(id, withSource = false) {
    const include = withSource ? "source" : null;
    const location = yield call(introduced, urlWithParameters(`/postings/${id}`, {include}));
    return yield call(callNode, {
        location, schema: NodeApi.PostingInfo, withBodies: true, errorFilter: ["posting.not-found"]
    });
}

export function* postPosting(postingText) {
    const location = yield call(authorized, "/postings");
    return yield call(callNode, {
        location, method: "POST", body: postingText, schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* putPosting(id, postingText) {
    const location = yield call(authorized, `/postings/${id}`);
    return yield call(callNode, {
        location, method: "PUT", body: postingText, schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePosting(id) {
    const location = yield call(authorized, `/postings/${id}`);
    return yield call(callNode, {location, method: "DELETE", schema: NodeApi.Result});
}

export function* postReaction(postingId, negative, emoji) {
    const ownerName = yield select(getHomeOwnerName);
    const body = {ownerName, negative, emoji};
    const location = yield call(introduced, `/postings/${postingId}/reactions`);
    return yield call(callNode, {location, method: "POST", body, schema: NodeApi.ReactionCreated});
}

export function* getReaction(postingId) {
    const ownerName = yield select(getHomeOwnerName);
    const location = yield call(introduced, `/postings/${postingId}/reactions/${ownerName}`);
    return yield call(callNode, {location, schema: NodeApi.ReactionInfo});
}

export function* deleteReaction(postingId) {
    const ownerName = yield select(getHomeOwnerName);
    const location = yield call(introduced, `/postings/${postingId}/reactions/${ownerName}`);
    return yield call(callNode, {location, method: "DELETE", schema: NodeApi.ReactionTotalsInfo});
}

export function* getReactionTotals(postingId) {
    const location = yield call(introduced, `/postings/${postingId}/reaction-totals`);
    return yield call(callNode, {location, schema: NodeApi.ReactionTotalsInfo});
}

export function* getReactions(postingId, negative, emoji, before, limit) {
    const location = yield call(introduced, urlWithParameters(`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit}));
    return yield call(callNode, {location, schema: NodeApi.ReactionsSliceInfo});
}

export function* getPostingDraftRevision(id) {
    const location = yield call(authorized, `/postings/${id}/revisions/draft`);
    return yield call(callNode, {
        location, schema: NodeApi.PostingInfo, withBodies: true, errorFilter: ["posting.not-found"]
    });
}

export function* putPostingDraftRevision(id, postingText) {
    const location = yield call(authorized, `/postings/${id}/revisions/draft`);
    return yield call(callNode, {
        location, method: "PUT", body: postingText, schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePostingDraftRevision(id) {
    const location = yield call(authorized, `/postings/${id}/revisions/draft`);
    return yield call(callNode, {location, method: "DELETE", schema: NodeApi.Result});
}

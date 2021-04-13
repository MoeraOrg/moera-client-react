import { apply, call, put, select } from 'redux-saga/effects';

import { formatSchemaErrors, HomeNotConnectedError, NameResolvingError, NodeApi, NodeApiError, NodeError } from "api";
import { errorAuthInvalid } from "state/error/actions";
import { nodeUrlToLocation, normalizeUrl, urlWithParameters } from "util/url";
import { getNodeRootLocation, getToken } from "state/node/selectors";
import { getCurrentCarte } from "state/cartes/selectors";
import { getHomeRootLocation, isConnectedToHome } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import { Browser } from "ui/browser";
import { retryFetch } from "api/fetch-timeout";

export function* callApi({
    location,
    nodeName = "",
    method = "GET",
    auth = false,
    body = null,
    schema = null,
    withBodies = false,
    errorFilter = false
}) {
    const {rootLocation, rootApi, errorTitle} = yield call(selectApi, nodeName);
    if (!rootLocation) {
        throw new NameResolvingError(nodeName);
    }
    const exception = (e, details) => new NodeError(method, rootApi, location, errorTitle, e, details);
    console.log(body);
    console.log(body instanceof File);
    const headers = {
        "Accept": "application/json",
        "Content-Type": body instanceof File ? body.type : "application/json"
    };
    yield call(authorize, headers, rootLocation, auth);
    let response;
    try {
        response = yield call(retryFetch, apiUrl(rootApi, location, method), {
            method,
            headers,
            body: encodeBody(body)
        });
    } catch (e) {
        throw exception(e);
    }
    let data;
    try {
        data = yield apply(response, "json");
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

export function* selectApi(nodeName) {
    let root;
    let errorTitle = "";
    switch (nodeName) {
        case null:
        case undefined:
        case "":
            root = yield select(state => ({
                location: getNodeRootLocation(state),
                api: state.node.root.api
            }));
            errorTitle = "Node access error";
            break;

        case ":":
            root = yield select(state => ({
                connected: isConnectedToHome(state),
                location: getHomeRootLocation(state),
                api: state.home.root.api
            }));
            if (!root.connected) {
                throw new HomeNotConnectedError();
            }
            errorTitle = "Home access error";
            break;

        default:
            if (nodeName.match(/^https?:/i)) {
                const location = normalizeUrl(nodeName);
                root = {
                    location,
                    api: location + "/moera/api"
                };
                errorTitle = "Home access error";
            } else {
                const nodeUri = yield call(getNodeUri, nodeName);
                root = nodeUri != null ?
                    {
                        location: nodeUrlToLocation(nodeUri),
                        api: nodeUri + "/api"
                    }
                :
                    {
                        location: "",
                        api: ""
                    }
                errorTitle = "Node access error";
            }
    }

    return {rootLocation: root.location, rootApi: root.api, errorTitle};
}

function* authorize(headers, rootLocation, auth) {
    if (auth === false) {
        return;
    }
    const token = auth === true ? yield select(state => getToken(state, rootLocation)) : auth;
    if (token != null) {
        headers["Authorization"] = `Bearer token:${token}`;
    } else {
        const carte = yield select(getCurrentCarte);
        if (carte != null) {
            headers["Authorization"] = `Bearer carte:${carte}`;
        }
    }
}

function apiUrl(rootApi, location, method) {
    if (["POST", "PUT", "DELETE"].includes(method)) {
        return urlWithParameters(rootApi + location, {"cid": Browser.clientId});
    } else {
        return rootApi + location;
    }
}

function encodeBody(body) {
    if (body == null) {
        return null;
    }
    if (body instanceof File) {
        return body;
    }
    return JSON.stringify(body);
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

function decodeBody(encoded, format, exception) {
    if (format != null && format.toLowerCase() === "application") {
        return {text: ""};
    }
    let body = JSON.parse(encoded);
    if (!NodeApi.Body(body)) {
        throw exception("Server returned incorrect response", formatSchemaErrors(NodeApi.Body.errors));
    }
    return body;
}

function decodeBodies(data, exception) {
    if (Array.isArray(data)) {
        return data.map(p => decodeBodies(p, exception));
    }

    const decoded = {...data};
    if (data.postings) {
        decoded.postings = data.postings.map(p => decodeBodies(p, exception));
    }
    if (data.stories) {
        decoded.stories = data.stories.map(p => decodeBodies(p, exception));
    }
    if (data.comments) {
        decoded.comments = data.comments.map(p => decodeBodies(p, exception));
    }
    if (data.comment) {
        decoded.comment = decodeBodies(data.comment, exception);
    }
    if (data.posting) {
        decoded.posting = decodeBodies(data.posting, exception);
    }
    if (data.body) {
        decoded.body = decodeBody(data.body, data.bodyFormat, exception);
    }
    if (data.bodyPreview) {
        decoded.bodyPreview = decodeBody(data.bodyPreview, data.bodyFormat, exception);
    }
    if (data.bodySrc) {
        decoded.bodySrc = decodeBody(data.bodySrc, data.bodySrcFormat, exception);
    }
    return decoded;
}

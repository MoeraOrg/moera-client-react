import { apply, call, put, select } from 'redux-saga/effects';

import { Browser, formatSchemaErrors, HomeNotConnectedError, NodeApi, NodeApiError, NodeError } from "api";
import { errorAuthInvalid } from "state/error/actions";
import { normalizeUrl, urlWithParameters } from "util/misc";
import { getToken } from "state/node/selectors";
import { getCurrentCarte } from "state/cartes/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";

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
    const exception = (e, details) => new NodeError(method, rootApi, location, errorTitle, e, details);
    location = yield call(authorize, location, rootLocation, auth);
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

function* selectApi(nodeName) {
    let root;
    let errorTitle = "";
    switch (nodeName) {
        case "":
            root = yield select(state => ({
                location: state.node.root.location,
                api: state.node.root.api
            }));
            errorTitle = "Node access error";
            break;

        case ":":
            root = yield select(state => ({
                connected: isConnectedToHome(state),
                location: state.home.root.location,
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
                        location: nodeUri.endsWith("/moera") ? nodeUri.substring(0, nodeUri.length - 6) : nodeUri,
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

function* authorize(location, rootLocation, auth) {
    if (auth === false) {
        return location;
    }
    const token = auth === true ? yield select(state => getToken(state, rootLocation)) : auth;
    const carte = token == null ? yield select(getCurrentCarte) : null;
    return urlWithParameters(location, {token, carte});
}

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
    if (data.stories) {
        decoded.stories = data.stories.map(p => decodeBodies(p, exception));
    }
    if (data.comments) {
        decoded.comments = data.comments.map(p => decodeBodies(p, exception));
    }
    if (data.posting) {
        decoded.posting = decodeBodies(data.posting, exception);
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

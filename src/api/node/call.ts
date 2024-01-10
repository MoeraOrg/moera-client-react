import { apply, call, put, select } from 'typed-redux-saga';
import { CallEffect, PutEffect, SelectEffect, TakeEffect } from 'redux-saga/effects';
import i18n from 'i18next';

import { formatSchemaErrors, HomeNotConnectedError, NameResolvingError, NodeApiError, NodeError } from "api";
import { validateSchema } from "api/node/safe";
import { retryFetch } from "api/fetch-timeout";
import { xhrFetch } from "api/node/xhr";
import { ProgressHandler } from "api/fetcher";
import { CausedError } from "api/error";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { errorAuthInvalid } from "state/error/actions";
import { messageBox } from "state/messagebox/actions";
import { cartesLoad } from "state/cartes/actions";
import { getNodeRootLocation, getToken } from "state/node/selectors";
import { getCurrentAllCarte } from "state/cartes/selectors";
import { getHomeRootLocation, isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import * as Browser from "ui/browser";
import { peek } from "util/saga-effects";
import { nodeUrlToLocation, normalizeUrl, urlWithParameters } from "util/url";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";

export type ErrorFilter = boolean | string[] | ((code: string) => boolean);

type CallException = (e: any, details?: string | null) => NodeError;

export interface CallApiParams {
    caller: ClientAction | null;
    location: string;
    nodeName?: string | null;
    method?: HttpMethod;
    auth?: boolean | string;
    body?: any;
    schema: string;
    decodeBodies?: boolean;
    errorFilter?: ErrorFilter;
    onProgress?: ProgressHandler;
}

export type CallApiResult<T> = Generator<CallEffect | PutEffect<any> | SelectEffect | TakeEffect, T>;

export function* callApi<T>({
    caller,
    location,
    nodeName = "",
    method = "GET" as const,
    auth = false,
    body = null,
    schema,
    decodeBodies: decode = false,
    errorFilter = false,
    onProgress
}: CallApiParams):  CallApiResult<T> {
    let rootLocation: string | null = null;
    let rootApi = "";
    let errorTitle = "";
    try {
        ({rootLocation, rootApi, errorTitle} = yield* call(selectApi, caller, nodeName));
    } catch (e) {
        if (e instanceof HomeNotConnectedError) {
            e.setQuery(method ?? "", location);
        }
        if (e instanceof CausedError) {
            e.cause = caller;
        }
        throw e;
    }
    if (!rootLocation) {
        throw new NameResolvingError(nodeName, caller);
    }

    const exception: CallException =
        (e, details) => new NodeError(method, rootApi, location, errorTitle, e, details, caller);
    const headers = {
        "Accept": "application/json",
        "Content-Type": body instanceof Blob ? body.type : "application/json"
    };

    let cartesRenewed = false;
    const fetcher = onProgress != null ? xhrFetch : retryFetch;
    while (true) {
        const authSuccess = yield* call(authorize, headers, rootLocation, auth);
        if (!authSuccess && !cartesRenewed) {
            yield* put(cartesLoad().causedBy(caller));
            yield* peek("CARTES_LOADED");
            cartesRenewed = true;
            continue;
        }

        let response: Response;
        try {
            response = yield* call(fetcher, apiUrl(rootApi, location, method), {
                method,
                headers,
                body: encodeBody(body),
                onProgress
            });
        } catch (e) {
            throw exception(e);
        }

        let data: any;
        try {
            if (schema === "blob" && response.ok) {
                data = yield* apply(response, "blob", []);
            } else {
                data = yield* apply(response, "json", []);
            }
        } catch (e) {
            if (!response.ok) {
                throw exception("Server returned error status");
            } else {
                throw exception("Server returned empty result");
            }
        }

        if (!response.ok) {
            const {valid} = yield* call(validateSchema, "Result", data, false);
            if (!valid) {
                throw exception("Server returned error status");
            }
            if (data.errorCode === "authentication.invalid") {
                yield* put(errorAuthInvalid());
                throw new NodeApiError(data.errorCode, data.message, caller);
            }
            if (data.errorCode === "authentication.blocked") {
                yield* put(messageBox(i18n.t("sorry-you-banned")));
                throw new NodeApiError(data.errorCode, data.message, caller);
            }
            if (data.errorCode.startsWith("carte.") && !cartesRenewed) {
                yield* put(cartesLoad().causedBy(caller));
                yield* peek("CARTES_LOADED");
                cartesRenewed = true;
                continue;
            }
            if (isErrorCodeAllowed(data.errorCode, errorFilter)) {
                throw new NodeApiError(data.errorCode, data.message, caller);
            } else {
                throw exception("Server returned error status: " + data.message);
            }
        }
        if (schema !== "blob") {
            const result = yield* call(validateSchema, schema, data, decode);
            const {valid, errors} = result;
            if (!valid) {
                throw exception("Server returned incorrect response", formatSchemaErrors(errors));
            }
            data = result.data;
        }

        return data;
    }
}

interface ApiSelection {
    rootLocation: string | null;
    rootApi: string;
    errorTitle: string;
}

export function* selectApi(
    caller: ClientAction | null, nodeName: string | null | undefined
): Generator<CallEffect | SelectEffect, ApiSelection> {
    let root;
    let errorTitle = "";
    switch (nodeName) {
        case null:
        case undefined:
        case "":
            root = yield* select(state => ({
                location: getNodeRootLocation(state),
                api: state.node.root.api
            }));
            errorTitle = "Node access error";
            break;

        case ":":
            root = yield* select(state => ({
                connected: isConnectedToHome(state),
                location: getHomeRootLocation(state),
                api: state.home.root.api
            }));
            if (!root.connected) {
                throw new HomeNotConnectedError(caller);
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
                const nodeUri = yield* call(getNodeUri, caller, nodeName);
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

function* authorize(headers: Partial<Record<string, string>>, rootLocation: string | null,
                    auth: boolean | string): Generator<SelectEffect, boolean> {
    if (auth === false) {
        return true;
    }
    const token = auth === true ? yield* select((state: ClientState) => getToken(state, rootLocation)) : auth;
    if (token != null) {
        headers["Authorization"] = `Bearer token:${token}`;
        return true;
    }
    const carte = yield* select(getCurrentAllCarte);
    if (carte != null) {
        headers["Authorization"] = `Bearer carte:${carte}`;
        return true;
    }
    const connected = yield* select((state: ClientState) => isConnectedToHome(state) && isHomeOwnerNameSet(state));
    if (!connected) {
        return true;
    }
    return false;
}

function apiUrl(rootApi: string, location: string, method: HttpMethod): string {
    if (["POST", "PUT", "DELETE"].includes(method)) {
        return urlWithParameters(rootApi + location, {"cid": Browser.clientId});
    } else {
        return rootApi + location;
    }
}

function encodeBody(body: null): null;
function encodeBody(body: any): string | null | Blob {
    if (body == null) {
        return null;
    }
    if (body instanceof Blob) {
        return body;
    }
    return JSON.stringify(body);
}

function isErrorCodeAllowed(errorCode: string, filter: ErrorFilter): boolean {
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

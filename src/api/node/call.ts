import { apply, call, put, select } from 'typed-redux-saga';
import { CallEffect, PutEffect, SelectEffect, TakeEffect } from 'redux-saga/effects';
import { ValidateFunction } from 'ajv';
import i18n from 'i18next';

import {
    Body,
    BodyFormat,
    CommentCreated,
    CommentInfo,
    CommentRevisionInfo,
    CommentsSliceInfo,
    DraftInfo,
    EncodedCommentCreated,
    EncodedCommentInfo,
    EncodedCommentRevisionInfo,
    EncodedCommentsSliceInfo,
    EncodedDraftInfo,
    EncodedEntryInfo,
    EncodedFeedSliceInfo,
    EncodedPostingInfo,
    EncodedPostingRevisionInfo,
    EncodedStoryInfo,
    EntryInfo,
    FeedSliceInfo,
    formatSchemaErrors,
    HomeNotConnectedError,
    NameResolvingError,
    NodeApiError,
    NodeError,
    PostingInfo,
    PostingRevisionInfo,
    SourceFormat,
    StoryInfo
} from "api";
import * as NodeApiSchema from "api/node/api-schemas"
import { retryFetch } from "api/fetch-timeout";
import { xhrFetch } from "api/node/xhr";
import { ProgressHandler } from "api/fetcher";
import { BodyError, CausedError } from "api/error";
import { isSchemaValid } from "api/schema";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { errorAuthInvalid } from "state/error/actions";
import { messageBox } from "state/messagebox/actions";
import { cartesLoad } from "state/cartes/actions";
import { getNodeRootLocation, getToken } from "state/node/selectors";
import { getCurrentAllCarte } from "state/cartes/selectors";
import { getHomeRootLocation, isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import { Browser } from "ui/browser";
import { peek } from "util/saga-effects";
import { nodeUrlToLocation, normalizeUrl, urlWithParameters } from "util/url";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";

export type ErrorFilter = boolean | string[] | ((code: string) => boolean);

type CallException = (e: any, details?: string | null) => NodeError;

export type CallApiParams<T> = {
    caller: ClientAction | null;
    location: string;
    nodeName?: string | null;
    method?: HttpMethod;
    auth?: boolean | string;
    body?: any;
    schema: ValidateFunction<T> | "blob";
    errorFilter?: ErrorFilter;
    onProgress?: ProgressHandler;
};

export type CallApiResult<T> = Generator<CallEffect | PutEffect<any> | SelectEffect | TakeEffect, T>;

export function* callApi<T>({
    caller,
    location,
    nodeName = "",
    method = "GET" as const,
    auth = false,
    body = null,
    schema,
    errorFilter = false,
    onProgress
}: CallApiParams<T>):  CallApiResult<T> {
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
            if (!isSchemaValid(NodeApiSchema.Result, data)) {
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
        if (schema !== "blob" && !isSchemaValid(schema, data)) {
            throw exception("Server returned incorrect response", formatSchemaErrors(schema.errors));
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

function decodeBody(caller: ClientAction | null, encoded: string, format: BodyFormat | SourceFormat | null): Body {
    if (format != null && format.toLowerCase() === "application") {
        return {text: ""};
    }
    let body = JSON.parse(encoded);
    if (!isSchemaValid(NodeApiSchema.Body, body)) {
        throw new BodyError(formatSchemaErrors(NodeApiSchema.Body.errors), caller);
    }
    return body;
}

type Entities = Partial<PostingInfo | PostingRevisionInfo | CommentInfo | CommentRevisionInfo | StoryInfo
    | CommentCreated | DraftInfo | FeedSliceInfo | CommentsSliceInfo | EntryInfo>;
type EncodedEntities = Partial<EncodedPostingInfo | EncodedPostingRevisionInfo | EncodedCommentInfo
    | EncodedCommentRevisionInfo | EncodedStoryInfo | EncodedCommentCreated | EncodedDraftInfo | EncodedFeedSliceInfo
    | EncodedCommentsSliceInfo | EncodedEntryInfo>;

export function decodeBodies(caller: ClientAction | null, data: EncodedPostingInfo): PostingInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedPostingRevisionInfo): PostingRevisionInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedPostingInfo[]): PostingInfo[];
export function decodeBodies(caller: ClientAction | null, data: EncodedPostingRevisionInfo[]): PostingRevisionInfo[];
export function decodeBodies(caller: ClientAction | null, data: EncodedCommentInfo): CommentInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedCommentRevisionInfo): CommentRevisionInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedCommentRevisionInfo[]): CommentRevisionInfo[];
export function decodeBodies(caller: ClientAction | null, data: EncodedStoryInfo): StoryInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedCommentCreated): CommentCreated;
export function decodeBodies(caller: ClientAction | null, data: EncodedDraftInfo): DraftInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedDraftInfo[]): DraftInfo[];
export function decodeBodies(caller: ClientAction | null, data: EncodedFeedSliceInfo): FeedSliceInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedCommentsSliceInfo): CommentsSliceInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedEntryInfo): EntryInfo;
export function decodeBodies(caller: ClientAction | null, data: EncodedEntryInfo[]): EntryInfo[];
export function decodeBodies(caller: ClientAction | null, data: EncodedEntities): Entities;
export function decodeBodies(
    caller: ClientAction | null, data: EncodedEntities | EncodedEntities[]
): Entities | Entities[] {
    if (Array.isArray(data)) {
        return data.map(p => decodeBodies(caller, p));
    }

    const decoded: any = {...data};
    if ("stories" in data && data.stories != null) {
        decoded.stories = data.stories.map(p => decodeBodies(caller, p));
    }
    if ("comments" in data && data.comments != null) {
        decoded.comments = data.comments.map(p => decodeBodies(caller, p));
    }
    if ("comment" in data && data.comment != null) {
        decoded.comment = decodeBodies(caller, data.comment);
    }
    if ("posting" in data && data.posting != null) {
        decoded.posting = decodeBodies(caller, data.posting);
    }
    if ("body" in data && data.body != null) {
        decoded.body = decodeBody(caller, data.body, data.bodyFormat ?? null);
    }
    if ("bodyPreview" in data && data.bodyPreview != null) {
        decoded.bodyPreview = decodeBody(caller, data.bodyPreview, data.bodyFormat ?? null);
    }
    if ("bodySrc" in data && data.bodySrc != null) {
        decoded.bodySrc = decodeBody(caller, data.bodySrc, data.bodySrcFormat ?? null);
    }
    return decoded;
}

import { CommentOperationsInfo, Features, PostingOperationsInfo, PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerName, getHomeRootLocation, isConnectedToHome } from "state/home/selectors";

export function isAtNode(state: ClientState): boolean {
    return !!state.node.root.api;
}

export function isAtHomeNode(state: ClientState): boolean {
    return state.home.root.api === state.node.root.api;
}

export function getNodeRootLocation(state: ClientState): string | null {
    return state.node.root.location;
}

export function getNodeRootPage(state: ClientState): string | null {
    return state.node.root.page;
}

export function getNodeFeatures(state: ClientState): Features | null {
    return state.node.features;
}

export function getToken(state: ClientState, rootLocation: string | null): string | null {
    if (rootLocation == null) {
        return null;
    }
    return state.tokens[rootLocation]?.token ?? null;
}

export function getNodeToken(state: ClientState): string | null {
    return getToken(state, getNodeRootLocation(state));
}

export function getNodePermissions(state: ClientState): string[] {
    const rootLocation = getNodeRootLocation(state);
    if (rootLocation == null) {
        return [];
    }
    return state.tokens[rootLocation]?.permissions ?? [];
}

export function getHomePermissions(state: ClientState): string[] {
    const rootLocation = getHomeRootLocation(state);
    if (rootLocation == null) {
        return [];
    }
    return state.tokens[rootLocation]?.permissions ?? [];
}

export function isNodeAdmin(state: ClientState): boolean {
    const permissions = getNodePermissions(state);
    // Permission "admin" may be saved for older tokens
    return isAtHomeNode(state) && permissions != null
        && (permissions.includes("other") || permissions.includes("admin"));
}

export function isReceiverAdmin(state: ClientState, receiverName: string | null): boolean {
    const permissions = getHomePermissions(state);
    // Permission "admin" may be saved for older tokens
    return getHomeOwnerName(state) === receiverName && permissions != null
        && (permissions.includes("other") || permissions.includes("admin"));
}

type AnyOperationsInfo = Partial<Record<string, PrincipalValue | null>>;

export interface ProtectedObject {
    ownerName?: string;
    receiverName?: string | null;
    operations?: AnyOperationsInfo | PostingOperationsInfo | CommentOperationsInfo | null;
    receiverOperations?: AnyOperationsInfo | PostingOperationsInfo | null;
    ownerOperations?: AnyOperationsInfo | PostingOperationsInfo | CommentOperationsInfo | null;
    seniorOperations?: AnyOperationsInfo | PostingOperationsInfo | CommentOperationsInfo | null;
    adminOperations?: AnyOperationsInfo | PostingOperationsInfo | CommentOperationsInfo | null;
}

type ObjectOperations = "normal" | "receiver" | "owner" | "senior" | "admin";

function getOperations(object: ProtectedObject, useOperations: ObjectOperations): AnyOperationsInfo | null {
    switch (useOperations) {
        case "normal":
            return object.operations as AnyOperationsInfo | null;
        case "receiver":
            return object.receiverOperations as AnyOperationsInfo | null;
        case "owner":
            return object.ownerOperations as AnyOperationsInfo | null;
        case "senior":
            return object.seniorOperations as AnyOperationsInfo | null;
        case "admin":
            return object.adminOperations as AnyOperationsInfo | null;
    }
}

export interface IsPermittedOptions {
    objectSourceName: string | null;
    useOperations: ObjectOperations;
}

const defaultIsPermittedOptions: IsPermittedOptions = {
    objectSourceName: null,
    useOperations: "normal"
};

export function isPermitted(operation: string, object: ProtectedObject | null, defaultValue: PrincipalValue,
                            state: ClientState, options: Partial<IsPermittedOptions> = {}): boolean {
    const op: IsPermittedOptions = {
        ...defaultIsPermittedOptions,
        useOperations: object?.receiverName != null ? "receiver" : "normal",
        ...options
    };

    let principal = defaultValue;
    if (object != null) {
        const operations = getOperations(object, op.useOperations);
        if (operations != null) {
            principal = operations[operation] ?? defaultValue;
        }
    }

    const ownerName = op.useOperations === "receiver" ? object?.receiverName : object?.ownerName;
    switch (principal) {
        case "none":
            break;
        case "public":
            return true;
        case "signed":
            if (isConnectedToHome(state)) {
                return true;
            }
            break;
        case "private":
            if (state.home.owner.name === ownerName) {
                return true;
            }
            if (op.objectSourceName != null
                ? isReceiverAdmin(state, op.objectSourceName)
                : isNodeAdmin(state)
            ) {
                return true;
            }
            break;
        case "owner":
            if (state.home.owner.name === ownerName) {
                return true;
            }
            break;
        case "admin":
            if (op.objectSourceName != null
                ? isReceiverAdmin(state, op.objectSourceName)
                : isNodeAdmin(state)
            ) {
                return true;
            }
            break;
        default:
            console.warn(`Don't know how to check '${principal}' principal`)
            break;
    }
    return false;
}

export interface IsPrincipalEqualsOptions {
    useOperations: ObjectOperations;
}

const defaultIsPrincipalEqualsOptions: IsPrincipalEqualsOptions = {
    useOperations: "normal"
};

export function isPrincipalIn(operation: string, object: ProtectedObject | null, defaultValue: PrincipalValue,
                              value: PrincipalValue | PrincipalValue[],
                              options: Partial<IsPrincipalEqualsOptions> = {}): boolean {
    const op: IsPrincipalEqualsOptions = {
        ...defaultIsPrincipalEqualsOptions,
        useOperations: object?.receiverName != null ? "receiver" : "normal",
        ...options
    };

    let principal = defaultValue;
    if (object != null) {
        const operations = getOperations(object, op.useOperations);
        if (operations != null) {
            principal = operations[operation] ?? defaultValue;
        }
    }

    return Array.isArray(value) ? value.includes(principal) : principal === value;
}

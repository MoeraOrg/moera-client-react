import { PostingOperationsInfo, PrincipalValue } from "api/node/api-types";
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
    return isAtHomeNode(state) && permissions != null && permissions.includes("admin");
}

export function isReceiverAdmin(state: ClientState, receiverName: string | null): boolean {
    const permissions = getHomePermissions(state);
    return getHomeOwnerName(state) === receiverName && permissions != null && permissions.includes("admin");
}

type AnyOperationsInfo = Partial<Record<string, PrincipalValue | null>>;

export interface ProtectedObject {
    ownerName?: string;
    operations?: AnyOperationsInfo | PostingOperationsInfo | null;
    receiverOperations?: AnyOperationsInfo | PostingOperationsInfo | null;
}

interface IsPermittedOptions {
    objectSourceName: string | null;
    useReceiverOperations: boolean;
    ifNoObject: boolean;
    ifNoOperation: boolean;
    ifUnknownPrincipal: boolean;
}

const defaultIsPermittedOptions: IsPermittedOptions = {
    objectSourceName: null,
    useReceiverOperations: false,
    ifNoObject: false,
    ifNoOperation: false,
    ifUnknownPrincipal: false
};

export function isPermitted(operation: string, object: ProtectedObject | null, state: ClientState,
                            options: Partial<IsPermittedOptions> = {}): boolean {
    const op: IsPermittedOptions = {...defaultIsPermittedOptions, ...options};
    if (object == null) {
        return op.ifNoObject;
    }
    const operations = op.useReceiverOperations ? object.receiverOperations : object.operations;
    if (operations == null) {
        return op.ifNoOperation;
    }
    const principal = (operations as AnyOperationsInfo)[operation];
    if (principal == null) {
        return op.ifNoOperation;
    }
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
            if (state.home.owner.name === object.ownerName) {
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
            if (state.home.owner.name === object.ownerName) {
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
            if (getNodePermissions(state).includes(principal)) { // FIXME not exactly
                return true;
            }
            break;
    }
    return op.ifUnknownPrincipal;
}

interface IsPrincipalEqualsOptions {
    useReceiverOperations: boolean;
    ifNoObject: boolean;
    ifNoOperation: boolean;
}

const defaultIsPrincipalEqualsOptions: IsPrincipalEqualsOptions = {
    useReceiverOperations: false,
    ifNoObject: false,
    ifNoOperation: false
};

export function isPrincipalEquals(operation: string, object: ProtectedObject | null, value: PrincipalValue,
                                  options: Partial<IsPrincipalEqualsOptions> = {}): boolean {
    const op: IsPrincipalEqualsOptions = {...defaultIsPrincipalEqualsOptions, ...options};
    if (object == null) {
        return op.ifNoObject;
    }
    const operations = op.useReceiverOperations ? object.receiverOperations : object.operations;
    if (operations == null) {
        return op.ifNoOperation;
    }
    return (operations as AnyOperationsInfo)[operation] === value;
}

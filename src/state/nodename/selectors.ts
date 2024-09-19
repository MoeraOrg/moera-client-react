import { isPermitted } from "state/node/selectors";
import { ClientState } from "state/state";

export function isNodeNameToBeLoaded(state: ClientState): boolean {
    return !state.nodeName.loaded && !state.nodeName.loading;
}

export function isNodeNameReady(state: ClientState): boolean {
    return state.nodeName.loaded && !state.nodeName.loading;
}

export function isNodeNameDefined(state: ClientState): boolean {
    return isNodeNameReady(state) && !!state.nodeName.name;
}

export function isNodeNameManageable(state: ClientState): boolean {
    return isNodeNameReady(state) && (isPermitted("manage", state.nodeName, "admin", state));
}

export function isNodeNameOperationPending(state: ClientState): boolean {
    switch (state.nodeName.operationStatus) {
        case "waiting":
        case "added":
        case "started":
            return true;
        default:
            return false;
    }
}

export function isNodeNameOperationFinished(state: ClientState): boolean {
    return state.nodeName.operationStatus != null && !isNodeNameOperationPending(state);
}

export function hasNodeNameStoredMnemonic(state: ClientState): boolean {
    return state.nodeName.storedMnemonic;
}

import { isPermitted } from "state/node/selectors";

export function isNodeNameToBeLoaded(state) {
    return !state.nodeName.loaded && !state.nodeName.loading;
}

export function isNodeNameReady(state) {
    return state.nodeName.loaded && !state.nodeName.loading;
}

export function isNodeNameDefined(state) {
    return isNodeNameReady(state) && !!state.nodeName.name;
}

export function isNodeNameManageable(state) {
    return isNodeNameReady(state) && isPermitted("manage", state.nodeName, state);
}

export function isNodeNameOperationPending(state) {
    switch (state.nodeName.operationStatus) {
        case "waiting":
        case "added":
        case "started":
            return true;
        default:
            return false;
    }
}

export function isNodeNameOperationFinished(state) {
    return state.nodeName.operationStatus != null && !isNodeNameOperationPending(state);
}

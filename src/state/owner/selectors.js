import { isNodeNameOperationFinished } from "state/nodename/selectors";

export function getOwnerName(state) {
    return state.owner.name;
}

export function getOwnerFullName(state) {
    return state.owner.fullName;
}

export function isOwnerNameSet(state) {
    return getOwnerName(state) != null;
}

export function isOwnerNameRecentlyChanged(state) {
    return isOwnerNameSet(state)
        && (state.owner.verifiedAt === 0
            || (isNodeNameOperationFinished(state)
                && state.owner.verifiedAt < state.nodeName.operationStatusUpdated));
}

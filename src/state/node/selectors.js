import selectn from 'selectn';

import { getHomeOwnerName } from "state/home/selectors";

export function isAtNode(state) {
    return !!state.node.root.api;
}

export function isAtHomeNode(state) {
    return state.home.root.api === state.node.root.api;
}

export function getNodeRootLocation(state) {
    return state.node.root.location;
}

export function getToken(state, rootLocation) {
    return selectn(["tokens", rootLocation, "token"], state);
}

export function getNodeToken(state) {
    return getToken(state, getNodeRootLocation(state));
}

export function getNodePermissions(state) {
    return selectn(["tokens", getNodeRootLocation(state), "permissions"], state) ?? [];
}

export function getHomePermissions(state) {
    return selectn(["tokens", getNodeRootLocation(state), "permissions"], state) ?? [];
}

export function isNodeAdmin(state) {
    const permissions = getNodePermissions(state);
    return isAtHomeNode(state) && permissions != null && permissions.includes("admin");
}

export function isReceiverAdmin(state, receiverName) {
    const permissions = getHomePermissions(state);
    return getHomeOwnerName(state) === receiverName && permissions != null && permissions.includes("admin");
}

export function isPermitted(operation, object, state, receiverName = null) {
    const requirements = selectn(["operations", operation], object);
    if (requirements == null) {
        return false;
    }
    for (let r of requirements) {
        switch (r) {
            case "public":
                return true;
            case "owner":
                if (state.home.owner.name === object.ownerName) {
                    return true;
                }
                break;
            case "admin":
                if (receiverName != null ? isReceiverAdmin(state, receiverName) : isNodeAdmin(state)) {
                    return true;
                }
                break;
            default:
                if (getNodePermissions(state).includes(r)) {
                    return true;
                }
                break;
        }
    }
    return false;
}

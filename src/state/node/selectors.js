import selectn from 'selectn';
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { getCommentsState } from "state/detailedposting/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameDetails } from "state/naming/selectors";
import { normalizeUrl, toWsUrl } from "util/misc";

export function isAtHomeNode(state) {
    return state.home.root.api === state.node.root.api;
}

export function getToken(state, rootLocation) {
    return selectn(["tokens", rootLocation, "token"], state);
}

export function getNodeToken(state) {
    return getToken(state, state.node.root.location);
}

export function getNodePermissions(state) {
    return selectn(["tokens", state.node.root.location, "permissions"], state);
}

export function isNodeAdmin(state) {
    const permissions = getNodePermissions(state);
    return isAtHomeNode(state) && permissions != null && permissions.includes("admin");
}

export function isPermitted(operation, object, state) {
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
                if (isNodeAdmin(state)) {
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

export function getReceiverNodeName(state) {
    if (isAtDetailedPostingPage(state)) {
        const receiverName = getCommentsState(state).receiverName;
        return receiverName != null && receiverName !== getOwnerName(state) ? receiverName : null;
    }
}

export function getReceiverNodeUri(state) {
    const receiverName = getReceiverNodeName(state);
    if (receiverName == null) {
        return null;
    }
    const details = getNamingNameDetails(state, receiverName);
    return details.loaded && details.nodeUri != null ? details.nodeUri : null;
}

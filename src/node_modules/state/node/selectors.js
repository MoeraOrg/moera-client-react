import selectn from 'selectn';

export function isAtHomeNode(state) {
    return state.home.root.api === state.node.root.api;
}

export function getNodeToken(state) {
    return selectn(["tokens", state.node.root.location, "token"], state);
}

export function getNodePermissions(state) {
    return selectn(["tokens", state.node.root.location, "permissions"], state);
}

export function isNodeAdmin(state) {
    const permissions = getNodePermissions(state);
    return isAtHomeNode(state) && permissions != null && permissions.includes("admin");
}

export function isPermitted(operation, object, state) {
    const requirements = object.operations[operation];
    if (!requirements) {
        return false;
    }
    for (let r of requirements) {
        switch (r) {
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

import selectn from 'selectn';

export function getHomeToken(state) {
    return selectn(["tokens", state.home.root.location, "token"], state);
}

export function isConnectedToHome(state) {
    return !!getHomeToken(state);
}

export function getHomePermissions(state) {
    return selectn(["tokens", state.home.root.location, "permissions"], state);
}

export function getHomeOwnerName(state) {
    return state.home.owner.name;
}

export function isHomeOwnerNameSet(state) {
    return !!getHomeOwnerName(state);
}

export function getHomeConnectionData(state) {
    return {
        location: state.home.root.location,
        login: state.home.login,
        token: getHomeToken(state),
        permissions: getHomePermissions(state)
    }
}

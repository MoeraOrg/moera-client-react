import selectn from 'selectn';

import { getToken } from "state/node/selectors";

export function getHomeToken(state) {
    return getToken(state, state.home.root.location);
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
        addonApiVersion: getAddonApiVersion(state),
        location: state.home.root.location,
        login: state.home.login,
        token: getHomeToken(state),
        permissions: getHomePermissions(state)
    }
}

export function getAddonApiVersion(state) {
    return state.home.addonApiVersion ?? 1;
}

export function hasInactiveConnections(state) {
    return state.home.roots.length > 1;
}

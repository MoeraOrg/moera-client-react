import selectn from 'selectn';

import { getToken } from "state/node/selectors";

export function getHomeRootLocation(state) {
    return state.home.root.location;
}

export function getHomeRootPage(state) {
    return state.home.root.page;
}

export function getHomeToken(state) {
    return getToken(state, getHomeRootLocation(state));
}

export function isConnectedToHome(state) {
    return !!getHomeToken(state);
}

export function getHomePermissions(state) {
    return selectn(["tokens", getHomeRootLocation(state), "permissions"], state);
}

export function getHomeOwnerName(state) {
    return state.home.owner.name;
}

export function getHomeOwnerFullName(state) {
    return state.home.owner.fullName;
}

export function getHomeOwnerAvatar(state) {
    return state.home.owner.avatar;
}

export function isHomeOwnerNameSet(state) {
    return !!getHomeOwnerName(state);
}

export function getHomeConnectionData(state) {
    return {
        addonApiVersion: getAddonApiVersion(state),
        location: getHomeRootLocation(state),
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

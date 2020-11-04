import selectn from 'selectn';
import { fromUnixTime, isBefore, subDays } from 'date-fns';

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

export function isHomeOwnerNameExpiring(state) {
    return state.home.owner.verified && state.home.owner.correct && state.home.owner.deadline != null
        && !isBefore(new Date(), subDays(fromUnixTime(state.home.owner.deadline), 30));
}

export function getAddonApiVersion(state) {
    return state.home.addonApiVersion ?? 1;
}

export function hasInactiveConnections(state) {
    return state.home.roots.length > 1;
}

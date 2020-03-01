import selectn from 'selectn';
import moment from "moment";

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
        addonApiVersion: getAddonApiVersion(state),
        location: state.home.root.location,
        login: state.home.login,
        token: getHomeToken(state),
        permissions: getHomePermissions(state)
    }
}

export function isHomeOwnerNameExpiring(state) {
    return state.home.owner.verified && state.home.owner.correct && state.home.owner.deadline != null
        && moment().isSameOrAfter(moment.unix(state.home.owner.deadline).subtract(30, "days"));
}

export function getAddonApiVersion(state) {
    return state.home.addonApiVersion ?? 1;
}

import { now } from "util/misc";

const USED_NAME_RELOAD_PERIOD = 6 * 60 * 60;

function isNamingNameToBeLoaded(state, name) {
    if (!name) {
        return false;
    }
    const details = state.naming.names[name];
    return details != null
        && (!details.loaded || now() - details.updated >= USED_NAME_RELOAD_PERIOD)
        && !details.loading;
}

export function getNamingNamesToBeLoaded(state, names) {
    return names.filter(name => isNamingNameToBeLoaded(state, name));
}

export function getNamingNameDetails(state, name) {
    const details = state.naming.names[name];
    return details ? details : {
        loading: false,
        loaded: false,
        nodeUri: null
    }
}

export function getNamingNameNodeUri(state, name) {
    const details = getNamingNameDetails(state, name);
    return details.loaded && details.nodeUri != null ? details.nodeUri : null;
}

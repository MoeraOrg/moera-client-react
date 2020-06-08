export function isNamingNameToBeLoaded(state, name) {
    if (!name) {
        return false;
    }
    const details = state.naming.names[name];
    return details != null && !details.loaded && !details.loading;
}

export function getNamingNameDetails(state, name) {
    const details = state.naming.names[name];
    return details ? details : {
        loading: false,
        loaded: false,
        latest: false,
        nodeUri: null
    }
}

export function isNamingNameLatest(state, name) {
    return getNamingNameDetails(state, name).latest;
}

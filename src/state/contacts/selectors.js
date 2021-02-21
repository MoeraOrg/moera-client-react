export function isContactsQueryToBeLoaded(state, query) {
    const info = state.contacts.queries[query];
    return info == null || (!info.loaded && !info.loading);
}

export function getContacts(state) {
    return state.contacts.contacts;
}

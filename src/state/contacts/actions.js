export const CONTACTS_PREPARE = "CONTACTS_PREPARE";
export const contactsPrepare = (query) => ({
    type: CONTACTS_PREPARE,
    payload: {query}
});

export const CONTACTS_LOAD = "CONTACTS_LOAD";
export const contactsLoad = (query) => ({
    type: CONTACTS_LOAD,
    payload: {query}
});

export const CONTACTS_LOADED = "CONTACTS_LOADED";
export const contactsLoaded = (query, contacts) => ({
    type: CONTACTS_LOADED,
    payload: {query, contacts}
});

export const CONTACTS_LOAD_FAILED = "CONTACTS_LOAD_FAILED";
export const contactsLoadFailed = (query) => ({
    type: CONTACTS_LOAD_FAILED,
    payload: {query}
});

export const CONTACTS_UNSET = "CONTACTS_UNSET";
export const contactsUnset = () => ({
    type: CONTACTS_UNSET
});

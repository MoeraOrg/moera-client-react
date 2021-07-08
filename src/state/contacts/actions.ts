import { ActionBase } from "state/action-base";
import { ContactInfo } from "api/node/api-types";

export const CONTACTS_PREPARE = "CONTACTS_PREPARE";
type ContactsPrepareAction = ActionBase<typeof CONTACTS_PREPARE, {
    query: string;
}>;
export const contactsPrepare = (query: string): ContactsPrepareAction => ({
    type: CONTACTS_PREPARE,
    payload: {query}
});

export const CONTACTS_LOAD = "CONTACTS_LOAD";
type ContactsLoadAction = ActionBase<typeof CONTACTS_LOAD, {
    query: string;
}>;
export const contactsLoad = (query: string): ContactsLoadAction => ({
    type: CONTACTS_LOAD,
    payload: {query}
});

export const CONTACTS_LOADED = "CONTACTS_LOADED";
type ContactsLoadedAction = ActionBase<typeof CONTACTS_LOADED, {
    query: string;
    contacts: ContactInfo[];
}>;
export const contactsLoaded = (query: string, contacts: ContactInfo[]): ContactsLoadedAction => ({
    type: CONTACTS_LOADED,
    payload: {query, contacts}
});

export const CONTACTS_LOAD_FAILED = "CONTACTS_LOAD_FAILED";
type ContactsLoadFailedAction = ActionBase<typeof CONTACTS_LOAD_FAILED, {
    query: string;
}>;
export const contactsLoadFailed = (query: string): ContactsLoadFailedAction => ({
    type: CONTACTS_LOAD_FAILED,
    payload: {query}
});

export const CONTACTS_UNSET = "CONTACTS_UNSET";
type ContactsUnsetAction = ActionBase<typeof CONTACTS_UNSET, never>;
export const contactsUnset = (): ContactsUnsetAction => ({
    type: CONTACTS_UNSET
});

export type ContactsAnyAction =
    ContactsPrepareAction
    | ContactsLoadAction
    | ContactsLoadedAction
    | ContactsLoadFailedAction
    | ContactsUnsetAction;

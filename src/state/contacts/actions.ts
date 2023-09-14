import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { ContactInfo } from "api";

export const CONTACTS_PREPARE = "CONTACTS_PREPARE";
export type ContactsPrepareAction = ActionWithPayload<typeof CONTACTS_PREPARE, {
    query: string;
}>;
export const contactsPrepare = (query: string): ContactsPrepareAction => ({
    type: CONTACTS_PREPARE,
    payload: {query}
});

export const CONTACTS_LOAD = "CONTACTS_LOAD";
export type ContactsLoadAction = ActionWithPayload<typeof CONTACTS_LOAD, {
    query: string;
}>;
export const contactsLoad = (query: string): ContactsLoadAction => ({
    type: CONTACTS_LOAD,
    payload: {query}
});

export const CONTACTS_LOADED = "CONTACTS_LOADED";
export type ContactsLoadedAction = ActionWithPayload<typeof CONTACTS_LOADED, {
    query: string;
    contacts: ContactInfo[];
}>;
export const contactsLoaded = (query: string, contacts: ContactInfo[]): ContactsLoadedAction => ({
    type: CONTACTS_LOADED,
    payload: {query, contacts}
});

export const CONTACTS_NAME_FOUND = "CONTACTS_NAME_FOUND";
export type ContactsNameFoundAction = ActionWithPayload<typeof CONTACTS_NAME_FOUND, {
    nodeName: string;
}>;
export const contactsNameFound = (nodeName: string): ContactsNameFoundAction => ({
    type: CONTACTS_NAME_FOUND,
    payload: {nodeName}
});

export const CONTACTS_LOAD_FAILED = "CONTACTS_LOAD_FAILED";
export type ContactsLoadFailedAction = ActionWithPayload<typeof CONTACTS_LOAD_FAILED, {
    query: string;
}>;
export const contactsLoadFailed = (query: string): ContactsLoadFailedAction => ({
    type: CONTACTS_LOAD_FAILED,
    payload: {query}
});

export const CONTACTS_UNSET = "CONTACTS_UNSET";
export type ContactsUnsetAction = Action<typeof CONTACTS_UNSET>;
export const contactsUnset = (): ContactsUnsetAction => ({
    type: CONTACTS_UNSET
});

export type ContactsAnyAction =
    ContactsPrepareAction
    | ContactsLoadAction
    | ContactsLoadedAction
    | ContactsNameFoundAction
    | ContactsLoadFailedAction
    | ContactsUnsetAction;

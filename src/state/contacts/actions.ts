import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { ContactInfo } from "api";

export type ContactsPrepareAction = ActionWithPayload<"CONTACTS_PREPARE", {
    query: string;
}>;
export const contactsPrepare = (query: string): ContactsPrepareAction =>
    actionWithPayload("CONTACTS_PREPARE", {query});

export type ContactsLoadAction = ActionWithPayload<"CONTACTS_LOAD", {
    query: string;
}>;
export const contactsLoad = (query: string): ContactsLoadAction =>
    actionWithPayload("CONTACTS_LOAD", {query});

export type ContactsLoadedAction = ActionWithPayload<"CONTACTS_LOADED", {
    query: string;
    contacts: ContactInfo[];
}>;
export const contactsLoaded = (query: string, contacts: ContactInfo[]): ContactsLoadedAction =>
    actionWithPayload("CONTACTS_LOADED", {query, contacts});

export type ContactsNameFoundAction = ActionWithPayload<"CONTACTS_NAME_FOUND", {
    nodeName: string;
}>;
export const contactsNameFound = (nodeName: string): ContactsNameFoundAction =>
    actionWithPayload("CONTACTS_NAME_FOUND", {nodeName});

export type ContactsLoadFailedAction = ActionWithPayload<"CONTACTS_LOAD_FAILED", {
    query: string;
}>;
export const contactsLoadFailed = (query: string): ContactsLoadFailedAction =>
    actionWithPayload("CONTACTS_LOAD_FAILED", {query});

export type ContactsUnsetAction = ActionWithoutPayload<"CONTACTS_UNSET">;
export const contactsUnset = (): ContactsUnsetAction =>
    actionWithoutPayload("CONTACTS_UNSET");

export type ContactsAnyAction =
    ContactsPrepareAction
    | ContactsLoadAction
    | ContactsLoadedAction
    | ContactsNameFoundAction
    | ContactsLoadFailedAction
    | ContactsUnsetAction;

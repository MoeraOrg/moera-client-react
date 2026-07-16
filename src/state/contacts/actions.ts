import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { SearchNodeInfo } from "api";

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
    contacts: SearchNodeInfo[];
}>;
export const contactsLoaded = (query: string, contacts: SearchNodeInfo[]): ContactsLoadedAction =>
    actionWithPayload("CONTACTS_LOADED", {query, contacts});

export type ContactsLoadFailedAction = ActionWithPayload<"CONTACTS_LOAD_FAILED", {
    query: string;
}>;
export const contactsLoadFailed = (query: string): ContactsLoadFailedAction =>
    actionWithPayload("CONTACTS_LOAD_FAILED", {query});

export type VisitedContactsPrepareAction = ActionWithPayload<"VISITED_CONTACTS_PREPARE", {
    query: string;
}>;
export const visitedContactsPrepare = (query: string): VisitedContactsPrepareAction =>
    actionWithPayload("VISITED_CONTACTS_PREPARE", {query});

export type VisitedContactsLoadAction = ActionWithPayload<"VISITED_CONTACTS_LOAD", {
    query: string;
}>;
export const visitedContactsLoad = (query: string): VisitedContactsLoadAction =>
    actionWithPayload("VISITED_CONTACTS_LOAD", {query});

export type VisitedContactsLoadedAction = ActionWithPayload<"VISITED_CONTACTS_LOADED", {
    query: string;
    contacts: SearchNodeInfo[];
}>;
export const visitedContactsLoaded = (query: string, contacts: SearchNodeInfo[]): VisitedContactsLoadedAction =>
    actionWithPayload("VISITED_CONTACTS_LOADED", {query, contacts});

export type VisitedContactsLoadFailedAction = ActionWithPayload<"VISITED_CONTACTS_LOAD_FAILED", {
    query: string;
}>;
export const visitedContactsLoadFailed = (query: string): VisitedContactsLoadFailedAction =>
    actionWithPayload("VISITED_CONTACTS_LOAD_FAILED", {query});

export type ContactsNameFoundAction = ActionWithPayload<"CONTACTS_NAME_FOUND", {
    nodeName: string;
}>;
export const contactsNameFound = (nodeName: string): ContactsNameFoundAction =>
    actionWithPayload("CONTACTS_NAME_FOUND", {nodeName});

export type ContactsAnyAction =
    ContactsPrepareAction
    | ContactsLoadAction
    | ContactsLoadedAction
    | ContactsLoadFailedAction
    | VisitedContactsPrepareAction
    | VisitedContactsLoadAction
    | VisitedContactsLoadedAction
    | VisitedContactsLoadFailedAction
    | ContactsNameFoundAction;

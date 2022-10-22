import { ClientState } from "state/state";
import { ContactInfo } from "api/node/api-types";

export function isContactsQueryToBeLoaded(state: ClientState, query: string): boolean {
    const info = state.contacts.queries[query];
    return info == null || (!info.loaded && !info.loading);
}

export function getContacts(state: ClientState): ContactInfo[] {
    return state.contacts.contacts;
}

export function hasContactsName(state: ClientState, nodeName: string) {
    return state.contacts.contacts.find(c => c.nodeName === nodeName) != null;
}

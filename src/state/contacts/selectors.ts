import { ClientState } from "state/state";
import { SearchNodeInfo } from "api";

export function isContactsQueryToBeLoaded(state: ClientState, query: string): boolean {
    const info = state.contacts.queries[query];
    return info == null || (!info.loaded && !info.loading);
}

export function getContacts(state: ClientState): SearchNodeInfo[] {
    return state.contacts.contacts;
}

export function hasContactsName(state: ClientState, nodeName: string) {
    return state.contacts.contacts.find(c => c.nodeName === nodeName) != null;
}

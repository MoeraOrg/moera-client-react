import { SearchNodeInfo } from "api";

export interface ContactsQueryState {
    loading: boolean;
    loaded: boolean;
}

export interface ContactsState {
    queries: Partial<Record<string, ContactsQueryState>>;
    contacts: SearchNodeInfo[];
}

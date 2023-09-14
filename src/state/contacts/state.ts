import { ContactInfo } from "api";

interface ContactsQueryState {
    loading: boolean;
    loaded: boolean;
}

export interface ContactsState {
    queries: Partial<Record<string, ContactsQueryState>>;
    contacts: ContactInfo[];
}

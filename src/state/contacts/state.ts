import { ContactInfo } from "api/node/api-types";

interface ContactsQueryState {
    loading: boolean;
    loaded: boolean;
}

export interface ContactsState {
    queries: Record<string, ContactsQueryState>;
    contacts: ContactInfo[];
}

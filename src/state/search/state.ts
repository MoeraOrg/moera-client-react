import { SearchEntryInfo } from "api";

export interface SearchState {
    query: string;
    loading: boolean;
    loaded: boolean;
    entries: SearchEntryInfo[];
}

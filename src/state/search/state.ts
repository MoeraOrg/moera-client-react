import { SearchEntryInfo } from "api";
import { ExtBody } from "state/postings/state";

export type SearchMode = "hashtag" | "fulltext";

export interface ExtSearchEntryInfo extends SearchEntryInfo {
    bodyPreview: ExtBody;
}

export interface SearchState {
    mode: SearchMode;
    query: string;
    loading: boolean;
    loaded: boolean;
    entries: ExtSearchEntryInfo[];
}

import { SearchEntryInfo } from "api";
import { ExtBody } from "state/postings/state";

export type SearchMode = "hashtag" | "fulltext";

export type SearchTab = "people" | "content" | "postings" | "comments" | "own-blog";

export interface ExtSearchEntryInfo extends SearchEntryInfo {
    bodyPreview: ExtBody;
}

export interface SearchState {
    mode: SearchMode;
    tab: SearchTab;
    query: string;
    loading: boolean;
    loaded: boolean;
    entries: ExtSearchEntryInfo[];
    after: number;
    nextPage: number;
    total: number;
}

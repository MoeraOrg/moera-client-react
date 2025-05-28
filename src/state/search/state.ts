import { SearchEntryInfo, SearchEntryType, SearchNodeInfo } from "api";
import { ExtBody } from "state/postings/state";

export type SearchMode = "hashtag" | "fulltext";

export type SearchTab = "people" | "content" | "postings" | "comments" | "current-blog" | "own-blog";

export interface ExtSearchEntryInfo extends SearchEntryInfo {
    bodyPreview: ExtBody;
}

export interface SearchFilter {
    entryType: SearchEntryType;
    inNewsfeed: boolean;
    ownedByMe: boolean;
    repliedToMe: boolean;
    minImageCount: number | null;
    videoPresent: boolean;
    safeSearch: boolean;
    afterDate: Date | null;
    beforeDate: Date | null;
}

export interface SearchState {
    mode: SearchMode;
    tab: SearchTab;
    query: string;
    filter: SearchFilter;
    loading: boolean;
    loaded: boolean;
    entries: ExtSearchEntryInfo[];
    nodes: SearchNodeInfo[];
    after: number;
    nextPage: number;
    total: number;
    scrollPosition: number;
    showFilters: boolean;
}

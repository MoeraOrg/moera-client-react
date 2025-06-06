import { SearchEntryInfo, SearchEntryType, SearchHistoryInfo, SearchNodeInfo } from "api";
import { ExtBody } from "state/postings/state";

export type SearchMode = "hashtag" | "fulltext";

export type SearchTab = "people" | "content" | "postings" | "comments" | "current-blog" | "own-blog";

export interface ExtSearchEntryInfo extends SearchEntryInfo {
    bodyPreview: ExtBody;
}

export type SearchFilterBeforeDate = "now" | "yesterday" | "week" | "month" | "3-months" | "year";

export type SearchFilterDatePeriod = "any" | "today" | "yesterday" | "week" | "month" | "3-months" | "year" | "year+";

export interface SearchFilter {
    entryType: SearchEntryType;
    inNewsfeed: boolean;
    ownedByMe: boolean;
    repliedToMe: boolean;
    minImageCount: number | null;
    videoPresent: boolean;
    safeSearch: boolean | null;
    beforeDate: SearchFilterBeforeDate;
    datePeriod: SearchFilterDatePeriod;
}

export interface SearchHistoryQueryState {
    loading: boolean;
    loaded: boolean;
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
    historyQueries: Partial<Record<string, SearchHistoryQueryState>>;
    history: SearchHistoryInfo[];
}

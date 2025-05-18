import { ClientState } from "state/state";
import { SearchMode, SearchTab } from "state/search/state";

export const SEARCH_PAGE_SIZE = 20;

export function getSearchMode(state: ClientState): SearchMode {
    return state.search.mode;
}

export function getSearchQuery(state: ClientState): string {
    return state.search.query;
}

export function getSearchTab(state: ClientState): SearchTab {
    return state.search.tab;
}

export function hasSearchMoreResults(state: ClientState): boolean {
    return (state.search.mode === "hashtag" && state.search.after > Number.MIN_SAFE_INTEGER)
        || (state.search.mode === "fulltext" && state.search.nextPage * SEARCH_PAGE_SIZE < state.search.total);
}

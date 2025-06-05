import { ClientState } from "state/state";
import { SearchFilter, SearchMode, SearchTab } from "state/search/state";
import { getSetting } from "state/settings/selectors";

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

export function getSearchFilter(state: ClientState): SearchFilter {
    return state.search.filter;
}

export function hasSearchMoreResults(state: ClientState): boolean {
    return (state.search.mode === "hashtag" && state.search.after > Number.MIN_SAFE_INTEGER)
        || (state.search.mode === "fulltext" && state.search.nextPage * SEARCH_PAGE_SIZE < state.search.total);
}

export const getSearchNodeName = (state: ClientState): string =>
    getSetting(state, "search.node-name") as string;

export const getSafeSearchDefault = (state: ClientState): boolean =>
    getSetting(state, "search.safe-search.default") as boolean;

export function isSearchHistoryQueryToBeLoaded(state: ClientState, query: string): boolean {
    const info = state.search.historyQueries[query];
    return info == null || (!info.loaded && !info.loading);
}

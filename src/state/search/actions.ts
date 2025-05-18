import { ActionWithoutPayload, actionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SearchHashtagSliceInfo, SearchTextPageInfo } from "api";
import { SearchTab } from "state/search/state";

export type SearchLoadAction = ActionWithPayload<"SEARCH_LOAD", {
    query: string;
    tab: SearchTab;
}>;
export const searchLoad = (query: string, tab: SearchTab): SearchLoadAction =>
    actionWithPayload("SEARCH_LOAD", {query, tab});

export type SearchLoadedAction = ActionWithPayload<"SEARCH_LOADED", {
    results: SearchHashtagSliceInfo | SearchTextPageInfo;
}>;
export const searchLoaded = (results: SearchHashtagSliceInfo | SearchTextPageInfo): SearchLoadedAction =>
    actionWithPayload("SEARCH_LOADED", {results});

export type SearchLoadFailedAction = ActionWithoutPayload<"SEARCH_LOAD_FAILED">;
export const searchLoadFailed = (): SearchLoadFailedAction =>
    actionWithoutPayload("SEARCH_LOAD_FAILED");

export type SearchLoadMoreAction = ActionWithoutPayload<"SEARCH_LOAD_MORE">;
export const searchLoadMore = (): SearchLoadMoreAction =>
    actionWithoutPayload("SEARCH_LOAD_MORE");

export type SearchAnyAction =
    SearchLoadAction
    | SearchLoadedAction
    | SearchLoadFailedAction
    | SearchLoadMoreAction;

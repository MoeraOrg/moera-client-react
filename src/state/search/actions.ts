import { ActionWithoutPayload, actionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SearchHashtagSliceInfo, SearchNodePageInfo, SearchTextPageInfo } from "api";
import { SearchTab } from "state/search/state";

export type SearchLoadAction = ActionWithPayload<"SEARCH_LOAD", {
    query: string;
    tab: SearchTab;
}>;
export const searchLoad = (query: string, tab: SearchTab): SearchLoadAction =>
    actionWithPayload("SEARCH_LOAD", {query, tab});

export type SearchHashtagLoadedAction = ActionWithPayload<"SEARCH_HASHTAG_LOADED", {
    slice: SearchHashtagSliceInfo;
}>;
export const searchHashtagLoaded = (slice: SearchHashtagSliceInfo): SearchHashtagLoadedAction =>
    actionWithPayload("SEARCH_HASHTAG_LOADED", {slice});

export type SearchTextLoadedAction = ActionWithPayload<"SEARCH_TEXT_LOADED", {
    page: SearchTextPageInfo;
}>;
export const searchTextLoaded = (page: SearchTextPageInfo): SearchTextLoadedAction =>
    actionWithPayload("SEARCH_TEXT_LOADED", {page});

export type SearchPeopleLoadedAction = ActionWithPayload<"SEARCH_PEOPLE_LOADED", {
    page: SearchNodePageInfo;
}>;
export const searchPeopleLoaded = (page: SearchNodePageInfo): SearchPeopleLoadedAction =>
    actionWithPayload("SEARCH_PEOPLE_LOADED", {page});

export type SearchLoadFailedAction = ActionWithoutPayload<"SEARCH_LOAD_FAILED">;
export const searchLoadFailed = (): SearchLoadFailedAction =>
    actionWithoutPayload("SEARCH_LOAD_FAILED");

export type SearchLoadMoreAction = ActionWithoutPayload<"SEARCH_LOAD_MORE">;
export const searchLoadMore = (): SearchLoadMoreAction =>
    actionWithoutPayload("SEARCH_LOAD_MORE");

export type SearchAnyAction =
    SearchLoadAction
    | SearchHashtagLoadedAction
    | SearchTextLoadedAction
    | SearchPeopleLoadedAction
    | SearchLoadFailedAction
    | SearchLoadMoreAction;

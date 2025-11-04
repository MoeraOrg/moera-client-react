import { ActionWithoutPayload, actionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SearchHashtagSliceInfo, SearchHistoryInfo, SearchNodePageInfo, SearchTextPageInfo } from "api";
import { SearchFilter, SearchTab } from "state/search/state";

export type SearchLoadAction = ActionWithPayload<"SEARCH_LOAD", {
    query: string;
    tab: SearchTab;
    filter: SearchFilter;
}>;
export const searchLoad = (query: string, tab: SearchTab, filter: SearchFilter): SearchLoadAction =>
    actionWithPayload("SEARCH_LOAD", {query, tab, filter});

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

export type SearchScrolledAction = ActionWithPayload<"SEARCH_SCROLLED", {
    position: number;
}>;
export const searchScrolled = (position: number): SearchScrolledAction =>
    actionWithPayload("SEARCH_SCROLLED", {position});

export type SearchRestoreScrollAction = ActionWithoutPayload<"SEARCH_RESTORE_SCROLL">;
export const searchRestoreScroll = (): SearchRestoreScrollAction =>
    actionWithoutPayload("SEARCH_RESTORE_SCROLL");

export type SearchOpenFilterDialogAction = ActionWithoutPayload<"SEARCH_OPEN_FILTER_DIALOG">;
export const searchOpenFilterDialog = (): SearchOpenFilterDialogAction =>
    actionWithoutPayload("SEARCH_OPEN_FILTER_DIALOG");

export type SearchCloseFilterDialogAction = ActionWithoutPayload<"SEARCH_CLOSE_FILTER_DIALOG">;
export const searchCloseFilterDialog = (): SearchCloseFilterDialogAction =>
    actionWithoutPayload("SEARCH_CLOSE_FILTER_DIALOG");

export type SearchHistoryPrepareAction = ActionWithPayload<"SEARCH_HISTORY_PREPARE", {
    query: string;
}>;
export const searchHistoryPrepare = (query: string): SearchHistoryPrepareAction =>
    actionWithPayload("SEARCH_HISTORY_PREPARE", {query});

export type SearchHistoryLoadAction = ActionWithPayload<"SEARCH_HISTORY_LOAD", {
    query: string;
}>;
export const searchHistoryLoad = (query: string): SearchHistoryLoadAction =>
    actionWithPayload("SEARCH_HISTORY_LOAD", {query});

export type SearchHistoryLoadedAction = ActionWithPayload<"SEARCH_HISTORY_LOADED", {
    query: string;
    history: SearchHistoryInfo[];
}>;
export const searchHistoryLoaded = (query: string, history: SearchHistoryInfo[]): SearchHistoryLoadedAction =>
    actionWithPayload("SEARCH_HISTORY_LOADED", {query, history});

export type SearchHistoryLoadFailedAction = ActionWithPayload<"SEARCH_HISTORY_LOAD_FAILED", {
    query: string;
}>;
export const searchHistoryLoadFailed = (query: string): SearchHistoryLoadFailedAction =>
    actionWithPayload("SEARCH_HISTORY_LOAD_FAILED", {query});

export type SearchHistoryAddAction = ActionWithPayload<"SEARCH_HISTORY_ADD", {
    history: SearchHistoryInfo;
}>;
export const searchHistoryAdd = (history: SearchHistoryInfo): SearchHistoryAddAction =>
    actionWithPayload("SEARCH_HISTORY_ADD", {history});

export type SearchHistoryDeleteAction = ActionWithPayload<"SEARCH_HISTORY_DELETE", {
    query: string;
}>;
export const searchHistoryDelete = (query: string): SearchHistoryDeleteAction =>
    actionWithPayload("SEARCH_HISTORY_DELETE", {query});

export type SearchEntryCopyLinkAction = ActionWithPayload<"SEARCH_ENTRY_COPY_LINK", {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const searchEntryCopyLink = (
    nodeName: string, postingId: string, commentId: string | null
): SearchEntryCopyLinkAction =>
    actionWithPayload("SEARCH_ENTRY_COPY_LINK", {nodeName, postingId, commentId});

export type SearchAnyAction =
    SearchLoadAction
    | SearchHashtagLoadedAction
    | SearchTextLoadedAction
    | SearchPeopleLoadedAction
    | SearchLoadFailedAction
    | SearchLoadMoreAction
    | SearchScrolledAction
    | SearchRestoreScrollAction
    | SearchOpenFilterDialogAction
    | SearchCloseFilterDialogAction
    | SearchHistoryPrepareAction
    | SearchHistoryLoadAction
    | SearchHistoryLoadedAction
    | SearchHistoryLoadFailedAction
    | SearchHistoryDeleteAction
    | SearchHistoryAddAction
    | SearchEntryCopyLinkAction;

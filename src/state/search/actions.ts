import { ActionWithoutPayload, actionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SearchEntryInfo } from "api";

export type SearchLoadAction = ActionWithPayload<"SEARCH_LOAD", {
    query: string;
}>;
export const searchLoad = (query: string): SearchLoadAction =>
    actionWithPayload("SEARCH_LOAD", {query});

export type SearchLoadedAction = ActionWithPayload<"SEARCH_LOADED", {
    query: string;
    entries: SearchEntryInfo[];
}>;
export const searchLoaded = (query: string, entries: SearchEntryInfo[]): SearchLoadedAction =>
    actionWithPayload("SEARCH_LOADED", {query, entries});

export type SearchLoadFailedAction = ActionWithoutPayload<"SEARCH_LOAD_FAILED">;
export const searchLoadFailed = (): SearchLoadFailedAction =>
    actionWithoutPayload("SEARCH_LOAD_FAILED");

export type SearchAnyAction =
    SearchLoadAction
    | SearchLoadedAction
    | SearchLoadFailedAction;

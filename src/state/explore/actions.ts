import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RecommendedNodeInfo, RecommendedPostingInfo } from "api";

export type ActivePeopleLoadAction = ActionWithoutPayload<"ACTIVE_PEOPLE_LOAD">;
export const activePeopleLoad = (): ActivePeopleLoadAction =>
    actionWithoutPayload("ACTIVE_PEOPLE_LOAD");

export type ActivePeopleLoadedAction = ActionWithPayload<"ACTIVE_PEOPLE_LOADED", {
    list: RecommendedNodeInfo[];
}>;
export const activePeopleLoaded = (list: RecommendedNodeInfo[]): ActivePeopleLoadedAction =>
    actionWithPayload("ACTIVE_PEOPLE_LOADED", {list});

export type ActivePeopleLoadFailedAction = ActionWithoutPayload<"ACTIVE_PEOPLE_LOAD_FAILED">;
export const activePeopleLoadFailed = (): ActivePeopleLoadFailedAction =>
    actionWithoutPayload("ACTIVE_PEOPLE_LOAD_FAILED");

export type TrendingLoadAction = ActionWithoutPayload<"TRENDING_LOAD">;
export const trendingLoad = (): TrendingLoadAction =>
    actionWithoutPayload("TRENDING_LOAD");

export type TrendingLoadedAction = ActionWithPayload<"TRENDING_LOADED", {
    list: RecommendedPostingInfo[];
}>;
export const trendingLoaded = (list: RecommendedPostingInfo[]): TrendingLoadedAction =>
    actionWithPayload("TRENDING_LOADED", {list});

export type TrendingLoadFailedAction = ActionWithoutPayload<"TRENDING_LOAD_FAILED">;
export const trendingLoadFailed = (): TrendingLoadFailedAction =>
    actionWithoutPayload("TRENDING_LOAD_FAILED");

export type DiscussionsLoadAction = ActionWithoutPayload<"DISCUSSIONS_LOAD">;
export const discussionsLoad = (): DiscussionsLoadAction =>
    actionWithoutPayload("DISCUSSIONS_LOAD");

export type DiscussionsLoadedAction = ActionWithPayload<"DISCUSSIONS_LOADED", {
    list: RecommendedPostingInfo[];
}>;
export const discussionsLoaded = (list: RecommendedPostingInfo[]): DiscussionsLoadedAction =>
    actionWithPayload("DISCUSSIONS_LOADED", {list});

export type DiscussionsLoadFailedAction = ActionWithoutPayload<"DISCUSSIONS_LOAD_FAILED">;
export const discussionsLoadFailed = (): DiscussionsLoadFailedAction =>
    actionWithoutPayload("DISCUSSIONS_LOAD_FAILED");

export type DiscussionsVisitedAction = ActionWithoutPayload<"DISCUSSIONS_VISITED">;
export const discussionsVisited = (): DiscussionsVisitedAction =>
    actionWithoutPayload("DISCUSSIONS_VISITED");

export type ExploreAnyAction =
    ActivePeopleLoadAction
    | ActivePeopleLoadedAction
    | ActivePeopleLoadFailedAction
    | TrendingLoadAction
    | TrendingLoadedAction
    | TrendingLoadFailedAction
    | DiscussionsLoadAction
    | DiscussionsLoadedAction
    | DiscussionsLoadFailedAction
    | DiscussionsVisitedAction;

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

export type ExploreAnyAction =
    ActivePeopleLoadAction
    | ActivePeopleLoadedAction
    | ActivePeopleLoadFailedAction
    | TrendingLoadAction
    | TrendingLoadedAction
    | TrendingLoadFailedAction;

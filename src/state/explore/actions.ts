import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RecommendedNodeInfo } from "api";

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

export type ExploreAnyAction =
    ActivePeopleLoadAction
    | ActivePeopleLoadedAction
    | ActivePeopleLoadFailedAction;

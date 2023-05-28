import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SheriffComplainGroupInfo, SheriffComplainInfo } from "api/node/api-types";

export const COMPLAINS_PAST_SLICE_LOAD = "COMPLAINS_PAST_SLICE_LOAD";
export type ComplainsPastSliceLoadAction = Action<typeof COMPLAINS_PAST_SLICE_LOAD>;
export const complainsPastSliceLoad = (): ComplainsPastSliceLoadAction => ({
    type: COMPLAINS_PAST_SLICE_LOAD
});

export const COMPLAINS_PAST_SLICE_LOAD_FAILED = "COMPLAINS_PAST_SLICE_LOAD_FAILED";
export type ComplainsPastSliceLoadFailedAction = Action<typeof COMPLAINS_PAST_SLICE_LOAD_FAILED>;
export const complainsPastSliceLoadFailed = (): ComplainsPastSliceLoadFailedAction => ({
    type: COMPLAINS_PAST_SLICE_LOAD_FAILED
});

export const COMPLAINS_FUTURE_SLICE_LOAD = "COMPLAINS_FUTURE_SLICE_LOAD";
export type ComplainsFutureSliceLoadAction = Action<typeof COMPLAINS_FUTURE_SLICE_LOAD>;
export const complainsFutureSliceLoad = (): ComplainsFutureSliceLoadAction => ({
    type: COMPLAINS_FUTURE_SLICE_LOAD
});

export const COMPLAINS_FUTURE_SLICE_LOAD_FAILED = "COMPLAINS_FUTURE_SLICE_LOAD_FAILED";
export type ComplainsFutureSliceLoadFailedAction = Action<typeof COMPLAINS_FUTURE_SLICE_LOAD_FAILED>;
export const complainsFutureSliceLoadFailed = (): ComplainsFutureSliceLoadFailedAction => ({
    type: COMPLAINS_FUTURE_SLICE_LOAD_FAILED
});

export const COMPLAINS_PAST_SLICE_SET = "COMPLAINS_PAST_SLICE_SET";
export type ComplainsPastSliceSetAction = ActionWithPayload<typeof COMPLAINS_PAST_SLICE_SET, {
    complainGroups: SheriffComplainGroupInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const complainsPastSliceSet = (complainGroups: SheriffComplainGroupInfo[], before: number, after: number,
                                      total: number, totalInPast: number,
                                      totalInFuture: number): ComplainsPastSliceSetAction => ({
    type: COMPLAINS_PAST_SLICE_SET,
    payload: {complainGroups, before, after, total, totalInPast, totalInFuture}
});

export const COMPLAINS_FUTURE_SLICE_SET = "COMPLAINS_FUTURE_SLICE_SET";
export type ComplainsFutureSliceSetAction = ActionWithPayload<typeof COMPLAINS_FUTURE_SLICE_SET, {
    complainGroups: SheriffComplainGroupInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const complainsFutureSliceSet = (complainGroups: SheriffComplainGroupInfo[], before: number, after: number,
                                        total: number, totalInPast: number,
                                        totalInFuture: number): ComplainsFutureSliceSetAction => ({
    type: COMPLAINS_FUTURE_SLICE_SET,
    payload: {complainGroups, before, after, total, totalInPast, totalInFuture}
});

export const COMPLAINS_GROUP_OPEN = "COMPLAINS_GROUP_OPEN";
export type ComplainsGroupOpenAction = ActionWithPayload<typeof COMPLAINS_GROUP_OPEN, {
    id: string;
}>;
export const complainsGroupOpen = (id: string): ComplainsGroupOpenAction => ({
    type: COMPLAINS_GROUP_OPEN,
    payload: {id}
});

export const COMPLAINS_GROUP_CLOSE = "COMPLAINS_GROUP_CLOSE";
export type ComplainsGroupCloseAction = Action<typeof COMPLAINS_GROUP_CLOSE>;
export const complainsGroupClose = (): ComplainsGroupCloseAction => ({
    type: COMPLAINS_GROUP_CLOSE
});

export const COMPLAINS_GROUP_LOAD = "COMPLAINS_GROUP_LOAD";
export type ComplainsGroupLoadAction = Action<typeof COMPLAINS_GROUP_LOAD>;
export const complainsGroupLoad = (): ComplainsGroupLoadAction => ({
    type: COMPLAINS_GROUP_LOAD
});

export const COMPLAINS_GROUP_LOADED = "COMPLAINS_GROUP_LOADED";
export type ComplainsGroupLoadedAction = ActionWithPayload<typeof COMPLAINS_GROUP_LOADED, {
    group: SheriffComplainGroupInfo;
}>;
export const complainsGroupLoaded = (group: SheriffComplainGroupInfo): ComplainsGroupLoadedAction => ({
    type: COMPLAINS_GROUP_LOADED,
    payload: {group}
});

export const COMPLAINS_GROUP_LOAD_FAILED = "COMPLAINS_GROUP_LOAD_FAILED";
export type ComplainsGroupLoadFailedAction = ActionWithPayload<typeof COMPLAINS_GROUP_LOAD_FAILED, {
    id: string;
}>;
export const complainsGroupLoadFailed = (id: string): ComplainsGroupLoadFailedAction => ({
    type: COMPLAINS_GROUP_LOAD_FAILED,
    payload: {id}
});

export const COMPLAINS_COMPLAINS_LOAD = "COMPLAINS_COMPLAINS_LOAD";
export type ComplainsComplainsLoadAction = Action<typeof COMPLAINS_COMPLAINS_LOAD>;
export const complainsComplainsLoad = (): ComplainsComplainsLoadAction => ({
    type: COMPLAINS_COMPLAINS_LOAD
});

export const COMPLAINS_COMPLAINS_LOADED = "COMPLAINS_COMPLAINS_LOADED";
export type ComplainsComplainsLoadedAction = ActionWithPayload<typeof COMPLAINS_COMPLAINS_LOADED, {
    groupId: string;
    complains: SheriffComplainInfo[];
}>;
export const complainsComplainsLoaded = (groupId: string,
                                         complains: SheriffComplainInfo[]): ComplainsComplainsLoadedAction => ({
    type: COMPLAINS_COMPLAINS_LOADED,
    payload: {groupId, complains}
});

export const COMPLAINS_COMPLAINS_LOAD_FAILED = "COMPLAINS_COMPLAINS_LOAD_FAILED";
export type ComplainsComplainsLoadFailedAction = ActionWithPayload<typeof COMPLAINS_COMPLAINS_LOAD_FAILED, {
    groupId: string;
}>;
export const complainsComplainsLoadFailed = (groupId: string): ComplainsComplainsLoadFailedAction => ({
    type: COMPLAINS_COMPLAINS_LOAD_FAILED,
    payload: {groupId}
});

export type ComplainsAnyAction = ComplainsPastSliceLoadAction
    | ComplainsPastSliceLoadFailedAction
    | ComplainsFutureSliceLoadAction
    | ComplainsFutureSliceLoadFailedAction
    | ComplainsPastSliceSetAction
    | ComplainsFutureSliceSetAction
    | ComplainsGroupOpenAction
    | ComplainsGroupCloseAction
    | ComplainsGroupLoadAction
    | ComplainsGroupLoadedAction
    | ComplainsGroupLoadFailedAction
    | ComplainsComplainsLoadAction
    | ComplainsComplainsLoadedAction
    | ComplainsComplainsLoadFailedAction;

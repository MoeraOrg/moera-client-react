import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SheriffComplainGroupInfo } from "api/node/api-types";

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

export type ComplainsAnyAction = ComplainsPastSliceLoadAction
    | ComplainsPastSliceLoadFailedAction
    | ComplainsFutureSliceLoadAction
    | ComplainsFutureSliceLoadFailedAction
    | ComplainsPastSliceSetAction
    | ComplainsFutureSliceSetAction
    | ComplainsGroupOpenAction
    | ComplainsGroupCloseAction;

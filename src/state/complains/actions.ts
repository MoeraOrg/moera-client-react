import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SheriffComplainDecisionText, SheriffComplainGroupInfo, SheriffComplainInfo } from "api";

export type ComplainsPastSliceLoadAction = ActionWithoutPayload<"COMPLAINS_PAST_SLICE_LOAD">;
export const complainsPastSliceLoad = (): ComplainsPastSliceLoadAction =>
    actionWithoutPayload("COMPLAINS_PAST_SLICE_LOAD");

export type ComplainsPastSliceLoadFailedAction = ActionWithoutPayload<"COMPLAINS_PAST_SLICE_LOAD_FAILED">;
export const complainsPastSliceLoadFailed = (): ComplainsPastSliceLoadFailedAction =>
    actionWithoutPayload("COMPLAINS_PAST_SLICE_LOAD_FAILED");

export type ComplainsFutureSliceLoadAction = ActionWithoutPayload<"COMPLAINS_FUTURE_SLICE_LOAD">;
export const complainsFutureSliceLoad = (): ComplainsFutureSliceLoadAction =>
    actionWithoutPayload("COMPLAINS_FUTURE_SLICE_LOAD");

export type ComplainsFutureSliceLoadFailedAction = ActionWithoutPayload<"COMPLAINS_FUTURE_SLICE_LOAD_FAILED">;
export const complainsFutureSliceLoadFailed = (): ComplainsFutureSliceLoadFailedAction =>
    actionWithoutPayload("COMPLAINS_FUTURE_SLICE_LOAD_FAILED");

export type ComplainsPastSliceSetAction = ActionWithPayload<"COMPLAINS_PAST_SLICE_SET", {
    complainGroups: SheriffComplainGroupInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const complainsPastSliceSet = (
    complainGroups: SheriffComplainGroupInfo[], before: number, after: number, total: number, totalInPast: number,
    totalInFuture: number
): ComplainsPastSliceSetAction =>
    actionWithPayload("COMPLAINS_PAST_SLICE_SET", {complainGroups, before, after, total, totalInPast, totalInFuture});

export type ComplainsFutureSliceSetAction = ActionWithPayload<"COMPLAINS_FUTURE_SLICE_SET", {
    complainGroups: SheriffComplainGroupInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const complainsFutureSliceSet = (
    complainGroups: SheriffComplainGroupInfo[], before: number, after: number, total: number, totalInPast: number,
    totalInFuture: number
): ComplainsFutureSliceSetAction =>
    actionWithPayload("COMPLAINS_FUTURE_SLICE_SET", {complainGroups, before, after, total, totalInPast, totalInFuture});

export type ComplainsInboxSetAction = ActionWithPayload<"COMPLAINS_INBOX_SET", {
    inboxOnly: boolean;
}>;
export const complainsInboxSet = (inboxOnly: boolean): ComplainsInboxSetAction =>
    actionWithPayload("COMPLAINS_INBOX_SET", {inboxOnly});

export type ComplainsGroupOpenAction = ActionWithPayload<"COMPLAINS_GROUP_OPEN", {
    id: string;
}>;
export const complainsGroupOpen = (id: string): ComplainsGroupOpenAction =>
    actionWithPayload("COMPLAINS_GROUP_OPEN", {id});

export type ComplainsGroupCloseAction = ActionWithoutPayload<"COMPLAINS_GROUP_CLOSE">;
export const complainsGroupClose = (): ComplainsGroupCloseAction =>
    actionWithoutPayload("COMPLAINS_GROUP_CLOSE");

export type ComplainsGroupLoadAction = ActionWithoutPayload<"COMPLAINS_GROUP_LOAD">;
export const complainsGroupLoad = (): ComplainsGroupLoadAction =>
    actionWithoutPayload("COMPLAINS_GROUP_LOAD");

export type ComplainsGroupLoadedAction = ActionWithPayload<"COMPLAINS_GROUP_LOADED", {
    group: SheriffComplainGroupInfo;
}>;
export const complainsGroupLoaded = (group: SheriffComplainGroupInfo): ComplainsGroupLoadedAction =>
    actionWithPayload("COMPLAINS_GROUP_LOADED", {group});

export type ComplainsGroupLoadFailedAction = ActionWithPayload<"COMPLAINS_GROUP_LOAD_FAILED", {
    id: string;
}>;
export const complainsGroupLoadFailed = (id: string): ComplainsGroupLoadFailedAction =>
    actionWithPayload("COMPLAINS_GROUP_LOAD_FAILED", {id});

export type ComplainsComplainsLoadAction = ActionWithoutPayload<"COMPLAINS_COMPLAINS_LOAD">;
export const complainsComplainsLoad = (): ComplainsComplainsLoadAction =>
    actionWithoutPayload("COMPLAINS_COMPLAINS_LOAD");

export type ComplainsComplainsLoadedAction = ActionWithPayload<"COMPLAINS_COMPLAINS_LOADED", {
    groupId: string;
    complains: SheriffComplainInfo[];
}>;
export const complainsComplainsLoaded = (
    groupId: string, complains: SheriffComplainInfo[]
): ComplainsComplainsLoadedAction =>
    actionWithPayload("COMPLAINS_COMPLAINS_LOADED", {groupId, complains});

export type ComplainsComplainsLoadFailedAction = ActionWithPayload<"COMPLAINS_COMPLAINS_LOAD_FAILED", {
    groupId: string;
}>;
export const complainsComplainsLoadFailed = (groupId: string): ComplainsComplainsLoadFailedAction =>
    actionWithPayload("COMPLAINS_COMPLAINS_LOAD_FAILED", {groupId});

export type ComplainsDecisionPostAction = ActionWithPayload<"COMPLAINS_DECISION_POST", {
    groupId: string;
    decision: SheriffComplainDecisionText;
}>;
export const complainsDecisionPost = (
    groupId: string, decision: SheriffComplainDecisionText
): ComplainsDecisionPostAction =>
    actionWithPayload("COMPLAINS_DECISION_POST", {groupId, decision});

export type ComplainsDecisionPostedAction = ActionWithPayload<"COMPLAINS_DECISION_POSTED", {
    group: SheriffComplainGroupInfo;
}>;
export const complainsDecisionPosted = (group: SheriffComplainGroupInfo): ComplainsDecisionPostedAction =>
    actionWithPayload("COMPLAINS_DECISION_POSTED", {group});

export type ComplainsDecisionPostFailedAction = ActionWithPayload<"COMPLAINS_DECISION_POST_FAILED", {
    groupId: string;
}>;
export const complainsDecisionPostFailed = (groupId: string): ComplainsDecisionPostFailedAction =>
    actionWithPayload("COMPLAINS_DECISION_POST_FAILED", {groupId});

export type ComplainsAnyAction = ComplainsPastSliceLoadAction
    | ComplainsPastSliceLoadFailedAction
    | ComplainsFutureSliceLoadAction
    | ComplainsFutureSliceLoadFailedAction
    | ComplainsPastSliceSetAction
    | ComplainsFutureSliceSetAction
    | ComplainsInboxSetAction
    | ComplainsGroupOpenAction
    | ComplainsGroupCloseAction
    | ComplainsGroupLoadAction
    | ComplainsGroupLoadedAction
    | ComplainsGroupLoadFailedAction
    | ComplainsComplainsLoadAction
    | ComplainsComplainsLoadedAction
    | ComplainsComplainsLoadFailedAction
    | ComplainsDecisionPostAction
    | ComplainsDecisionPostedAction
    | ComplainsDecisionPostFailedAction;

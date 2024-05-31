import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SheriffComplaintDecisionText, SheriffComplaintGroupInfo, SheriffComplaintInfo } from "api";

export type ComplaintsPastSliceLoadAction = ActionWithoutPayload<"COMPLAINTS_PAST_SLICE_LOAD">;
export const complaintsPastSliceLoad = (): ComplaintsPastSliceLoadAction =>
    actionWithoutPayload("COMPLAINTS_PAST_SLICE_LOAD");

export type ComplaintsPastSliceLoadFailedAction = ActionWithoutPayload<"COMPLAINTS_PAST_SLICE_LOAD_FAILED">;
export const complaintsPastSliceLoadFailed = (): ComplaintsPastSliceLoadFailedAction =>
    actionWithoutPayload("COMPLAINTS_PAST_SLICE_LOAD_FAILED");

export type ComplaintsFutureSliceLoadAction = ActionWithoutPayload<"COMPLAINTS_FUTURE_SLICE_LOAD">;
export const complaintsFutureSliceLoad = (): ComplaintsFutureSliceLoadAction =>
    actionWithoutPayload("COMPLAINTS_FUTURE_SLICE_LOAD");

export type ComplaintsFutureSliceLoadFailedAction = ActionWithoutPayload<"COMPLAINTS_FUTURE_SLICE_LOAD_FAILED">;
export const complaintsFutureSliceLoadFailed = (): ComplaintsFutureSliceLoadFailedAction =>
    actionWithoutPayload("COMPLAINTS_FUTURE_SLICE_LOAD_FAILED");

export type ComplaintsPastSliceSetAction = ActionWithPayload<"COMPLAINTS_PAST_SLICE_SET", {
    complaintGroups: SheriffComplaintGroupInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const complaintsPastSliceSet = (
    complaintGroups: SheriffComplaintGroupInfo[], before: number, after: number, total: number, totalInPast: number,
    totalInFuture: number
): ComplaintsPastSliceSetAction =>
    actionWithPayload("COMPLAINTS_PAST_SLICE_SET", {complaintGroups, before, after, total, totalInPast, totalInFuture});

export type ComplaintsFutureSliceSetAction = ActionWithPayload<"COMPLAINTS_FUTURE_SLICE_SET", {
    complaintGroups: SheriffComplaintGroupInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const complaintsFutureSliceSet = (
    complaintGroups: SheriffComplaintGroupInfo[], before: number, after: number, total: number, totalInPast: number,
    totalInFuture: number
): ComplaintsFutureSliceSetAction =>
    actionWithPayload(
        "COMPLAINTS_FUTURE_SLICE_SET",
        {complaintGroups, before, after, total, totalInPast, totalInFuture}
    );

export type ComplaintsInboxSetAction = ActionWithPayload<"COMPLAINTS_INBOX_SET", {
    inboxOnly: boolean;
}>;
export const complaintsInboxSet = (inboxOnly: boolean): ComplaintsInboxSetAction =>
    actionWithPayload("COMPLAINTS_INBOX_SET", {inboxOnly});

export type ComplaintsGroupOpenAction = ActionWithPayload<"COMPLAINTS_GROUP_OPEN", {
    id: string;
}>;
export const complaintsGroupOpen = (id: string): ComplaintsGroupOpenAction =>
    actionWithPayload("COMPLAINTS_GROUP_OPEN", {id});

export type ComplaintsGroupCloseAction = ActionWithoutPayload<"COMPLAINTS_GROUP_CLOSE">;
export const complaintsGroupClose = (): ComplaintsGroupCloseAction =>
    actionWithoutPayload("COMPLAINTS_GROUP_CLOSE");

export type ComplaintsGroupLoadAction = ActionWithoutPayload<"COMPLAINTS_GROUP_LOAD">;
export const complaintsGroupLoad = (): ComplaintsGroupLoadAction =>
    actionWithoutPayload("COMPLAINTS_GROUP_LOAD");

export type ComplaintsGroupLoadedAction = ActionWithPayload<"COMPLAINTS_GROUP_LOADED", {
    group: SheriffComplaintGroupInfo;
}>;
export const complaintsGroupLoaded = (group: SheriffComplaintGroupInfo): ComplaintsGroupLoadedAction =>
    actionWithPayload("COMPLAINTS_GROUP_LOADED", {group});

export type ComplaintsGroupLoadFailedAction = ActionWithPayload<"COMPLAINTS_GROUP_LOAD_FAILED", {
    id: string;
}>;
export const complaintsGroupLoadFailed = (id: string): ComplaintsGroupLoadFailedAction =>
    actionWithPayload("COMPLAINTS_GROUP_LOAD_FAILED", {id});

export type ComplaintsComplaintsLoadAction = ActionWithoutPayload<"COMPLAINTS_COMPLAINTS_LOAD">;
export const complaintsComplaintsLoad = (): ComplaintsComplaintsLoadAction =>
    actionWithoutPayload("COMPLAINTS_COMPLAINTS_LOAD");

export type ComplaintsComplaintsLoadedAction = ActionWithPayload<"COMPLAINTS_COMPLAINTS_LOADED", {
    groupId: string;
    complaints: SheriffComplaintInfo[];
}>;
export const complaintsComplaintsLoaded = (
    groupId: string, complaints: SheriffComplaintInfo[]
): ComplaintsComplaintsLoadedAction =>
    actionWithPayload("COMPLAINTS_COMPLAINTS_LOADED", {groupId, complaints});

export type ComplaintsComplaintsLoadFailedAction = ActionWithPayload<"COMPLAINTS_COMPLAINTS_LOAD_FAILED", {
    groupId: string;
}>;
export const complaintsComplaintsLoadFailed = (groupId: string): ComplaintsComplaintsLoadFailedAction =>
    actionWithPayload("COMPLAINTS_COMPLAINTS_LOAD_FAILED", {groupId});

export type ComplaintsDecisionPostAction = ActionWithPayload<"COMPLAINTS_DECISION_POST", {
    groupId: string;
    decision: SheriffComplaintDecisionText;
}>;
export const complaintsDecisionPost = (
    groupId: string, decision: SheriffComplaintDecisionText
): ComplaintsDecisionPostAction =>
    actionWithPayload("COMPLAINTS_DECISION_POST", {groupId, decision});

export type ComplaintsDecisionPostedAction = ActionWithPayload<"COMPLAINTS_DECISION_POSTED", {
    group: SheriffComplaintGroupInfo;
}>;
export const complaintsDecisionPosted = (group: SheriffComplaintGroupInfo): ComplaintsDecisionPostedAction =>
    actionWithPayload("COMPLAINTS_DECISION_POSTED", {group});

export type ComplaintsDecisionPostFailedAction = ActionWithPayload<"COMPLAINTS_DECISION_POST_FAILED", {
    groupId: string;
}>;
export const complaintsDecisionPostFailed = (groupId: string): ComplaintsDecisionPostFailedAction =>
    actionWithPayload("COMPLAINTS_DECISION_POST_FAILED", {groupId});

export type ComplaintsAnyAction = ComplaintsPastSliceLoadAction
    | ComplaintsPastSliceLoadFailedAction
    | ComplaintsFutureSliceLoadAction
    | ComplaintsFutureSliceLoadFailedAction
    | ComplaintsPastSliceSetAction
    | ComplaintsFutureSliceSetAction
    | ComplaintsInboxSetAction
    | ComplaintsGroupOpenAction
    | ComplaintsGroupCloseAction
    | ComplaintsGroupLoadAction
    | ComplaintsGroupLoadedAction
    | ComplaintsGroupLoadFailedAction
    | ComplaintsComplaintsLoadAction
    | ComplaintsComplaintsLoadedAction
    | ComplaintsComplaintsLoadFailedAction
    | ComplaintsDecisionPostAction
    | ComplaintsDecisionPostedAction
    | ComplaintsDecisionPostFailedAction;

import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type PostingReplyAction = ActionWithPayload<"POSTING_REPLY", {
    id: string;
}>;
export const postingReply = (id: string): PostingReplyAction =>
    actionWithPayload("POSTING_REPLY", {id});

export type PostingReplyFailedAction = ActionWithoutPayload<"POSTING_REPLY_FAILED">;
export const postingReplyFailed = () =>
    actionWithoutPayload("POSTING_REPLY_FAILED");

export type PostingReplyAnyAction =
    PostingReplyAction
    | PostingReplyFailedAction;

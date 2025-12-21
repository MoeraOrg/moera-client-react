import { actionWithPayload, ActionWithPayload } from "state/action-types";

export type PostingReplyAction = ActionWithPayload<"POSTING_REPLY", {
    id: string;
}>;
export const postingReply = (id: string): PostingReplyAction =>
    actionWithPayload("POSTING_REPLY", {id});

export type PostingReplyAnyAction =
    PostingReplyAction;

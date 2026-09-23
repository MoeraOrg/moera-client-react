import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";
import { PrincipalValue } from "api";

export type OpenRepostDialogAction = ActionWithPayload<"OPEN_REPOST_DIALOG", {
    nodeName: RelNodeName | string;
    postingId: string;
    heading: string;
    visible: PrincipalValue;
    fullName: string | null;
}>;
export const openRepostDialog = (
    nodeName: RelNodeName | string, fullName: string | null, postingId: string, heading: string, visible: PrincipalValue
): OpenRepostDialogAction =>
    actionWithPayload("OPEN_REPOST_DIALOG", {nodeName, postingId, heading, visible, fullName});

export type CloseRepostDialogAction = ActionWithoutPayload<"CLOSE_REPOST_DIALOG">;
export const closeRepostDialog = (): CloseRepostDialogAction =>
    actionWithoutPayload("CLOSE_REPOST_DIALOG");

export type RepostPostingAction = ActionWithPayload<"REPOST_POSTING", {
    nodeName: RelNodeName | string;
    postingId: string;
    postingView: PrincipalValue;
}>;
export const repostPosting = (
    nodeName: RelNodeName | string, postingId: string, postingView: PrincipalValue
): RepostPostingAction =>
    actionWithPayload("REPOST_POSTING", {nodeName, postingId, postingView});

export type RepostPostingSucceededAction = ActionWithoutPayload<"REPOST_POSTING_SUCCEEDED">;
export const repostPostingSucceeded = (): RepostPostingSucceededAction =>
    actionWithoutPayload("REPOST_POSTING_SUCCEEDED");

export type RepostPostingFailedAction = ActionWithoutPayload<"REPOST_POSTING_FAILED">;
export const repostPostingFailed = (): RepostPostingFailedAction =>
    actionWithoutPayload("REPOST_POSTING_FAILED");

export type RepostDialogAnyAction =
    OpenRepostDialogAction
    | CloseRepostDialogAction
    | RepostPostingAction
    | RepostPostingSucceededAction
    | RepostPostingFailedAction;

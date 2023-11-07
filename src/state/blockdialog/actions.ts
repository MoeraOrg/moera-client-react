import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { BlockedOperation, BlockedUserInfo } from "api";

export type OpenBlockDialogAction = ActionWithPayload<"OPEN_BLOCK_DIALOG", {
    nodeName: string;
    fullName: string | null;
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlocked: BlockedUserInfo[];
}>;
export const openBlockDialog = (
    nodeName: string, fullName: string | null, entryNodeName: string | null, entryPostingId: string | null,
    prevBlocked: BlockedUserInfo[]
): OpenBlockDialogAction =>
    actionWithPayload("OPEN_BLOCK_DIALOG", {nodeName, fullName, entryNodeName, entryPostingId, prevBlocked});

export type CloseBlockDialogAction = ActionWithoutPayload<"CLOSE_BLOCK_DIALOG">;
export const closeBlockDialog = (): CloseBlockDialogAction =>
    actionWithoutPayload("CLOSE_BLOCK_DIALOG");

export type BlockDialogSubmitAction = ActionWithPayload<"BLOCK_DIALOG_SUBMIT", {
    nodeName: string;
    formattedName: string;
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlockedUsers: BlockedUserInfo[];
    blockedOperations: BlockedOperation[];
    deadline: number | null;
    reasonSrc: string;
}>;
export const blockDialogSubmit = (
    nodeName: string, formattedName: string, entryNodeName: string | null, entryPostingId: string | null,
    prevBlockedUsers: BlockedUserInfo[], blockedOperations: BlockedOperation[], deadline: number | null,
    reasonSrc: string
): BlockDialogSubmitAction =>
    actionWithPayload(
        "BLOCK_DIALOG_SUBMIT",
        {
            nodeName, formattedName, entryNodeName, entryPostingId, prevBlockedUsers, blockedOperations, deadline,
            reasonSrc
        }
    );

export type BlockDialogSubmittedAction = ActionWithPayload<"BLOCK_DIALOG_SUBMITTED", {
    nodeName: string;
}>;
export const blockDialogSubmitted = (nodeName: string): BlockDialogSubmittedAction =>
    actionWithPayload("BLOCK_DIALOG_SUBMITTED", {nodeName});

export type BlockDialogSubmitFailedAction = ActionWithoutPayload<"BLOCK_DIALOG_SUBMIT_FAILED">;
export const blockDialogSubmitFailed = (): BlockDialogSubmitFailedAction =>
    actionWithoutPayload("BLOCK_DIALOG_SUBMIT_FAILED");

export type BlockedUserUnfriendAction = ActionWithPayload<"BLOCKED_USER_UNFRIEND", {
    nodeName: string;
    formattedName: string;
}>;
export const blockedUserUnfriend = (nodeName: string, formattedName: string): BlockedUserUnfriendAction =>
    actionWithPayload("BLOCKED_USER_UNFRIEND", {nodeName, formattedName});

export type BlockedUserUnsubscribeAction = ActionWithPayload<"BLOCKED_USER_UNSUBSCRIBE", {
    nodeName: string;
    formattedName: string;
}>;
export const blockedUserUnsubscribe = (nodeName: string, formattedName: string): BlockedUserUnsubscribeAction =>
    actionWithPayload("BLOCKED_USER_UNSUBSCRIBE", {nodeName, formattedName});

export type BlockDialogAnyAction =
    OpenBlockDialogAction
    | CloseBlockDialogAction
    | BlockDialogSubmitAction
    | BlockDialogSubmittedAction
    | BlockDialogSubmitFailedAction
    | BlockedUserUnfriendAction
    | BlockedUserUnsubscribeAction;

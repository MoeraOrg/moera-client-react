import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { BlockedOperation, BlockedUserInfo } from "api/node/api-types";

export const OPEN_BLOCK_DIALOG = "OPEN_BLOCK_DIALOG";
export type OpenBlockDialogAction = ActionWithPayload<typeof OPEN_BLOCK_DIALOG, {
    nodeName: string;
    fullName: string | null;
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlocked: BlockedUserInfo[];
}>;
export const openBlockDialog = (nodeName: string, fullName: string | null, entryNodeName: string | null,
                                entryPostingId: string | null,
                                prevBlocked: BlockedUserInfo[]): OpenBlockDialogAction => ({
    type: OPEN_BLOCK_DIALOG,
    payload: {nodeName, fullName, entryNodeName, entryPostingId, prevBlocked}
});

export const CLOSE_BLOCK_DIALOG = "CLOSE_BLOCK_DIALOG";
export type CloseBlockDialogAction = Action<typeof CLOSE_BLOCK_DIALOG>;
export const closeBlockDialog = (): CloseBlockDialogAction => ({
    type: CLOSE_BLOCK_DIALOG
});

export const BLOCK_DIALOG_SUBMIT = "BLOCK_DIALOG_SUBMIT";
export type BlockDialogSubmitAction = ActionWithPayload<typeof BLOCK_DIALOG_SUBMIT, {
    nodeName: string;
    formattedName: string;
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlockedUsers: BlockedUserInfo[];
    blockedOperations: BlockedOperation[];
    deadline: number | null;
    reasonSrc: string;
}>;
export const blockDialogSubmit = (nodeName: string,
                                  formattedName: string,
                                  entryNodeName: string | null,
                                  entryPostingId: string | null,
                                  prevBlockedUsers: BlockedUserInfo[],
                                  blockedOperations: BlockedOperation[],
                                  deadline: number | null,
                                  reasonSrc: string): BlockDialogSubmitAction => ({
    type: BLOCK_DIALOG_SUBMIT,
    payload: {
        nodeName, formattedName, entryNodeName, entryPostingId, prevBlockedUsers, blockedOperations, deadline, reasonSrc
    }
});

export const BLOCK_DIALOG_SUBMITTED = "BLOCK_DIALOG_SUBMITTED";
export type BlockDialogSubmittedAction = ActionWithPayload<typeof BLOCK_DIALOG_SUBMITTED, {
    nodeName: string;
}>;
export const blockDialogSubmitted = (nodeName: string): BlockDialogSubmittedAction => ({
    type: BLOCK_DIALOG_SUBMITTED,
    payload: {nodeName}
});

export const BLOCK_DIALOG_SUBMIT_FAILED = "BLOCK_DIALOG_SUBMIT_FAILED";
export type BlockDialogSubmitFailedAction = Action<typeof BLOCK_DIALOG_SUBMIT_FAILED>;
export const blockDialogSubmitFailed = (): BlockDialogSubmitFailedAction => ({
    type: BLOCK_DIALOG_SUBMIT_FAILED
});

export const BLOCKED_USER_UNFRIEND = "BLOCKED_USER_UNFRIEND";
export type BlockedUserUnfriendAction = ActionWithPayload<typeof BLOCKED_USER_UNFRIEND, {
    nodeName: string;
    formattedName: string;
}>;
export const blockedUserUnfriend = (nodeName: string, formattedName: string): BlockedUserUnfriendAction => ({
    type: BLOCKED_USER_UNFRIEND,
    payload: {nodeName, formattedName}
});

export const BLOCKED_USER_UNSUBSCRIBE = "BLOCKED_USER_UNSUBSCRIBE";
export type BlockedUserUnsubscribeAction = ActionWithPayload<typeof BLOCKED_USER_UNSUBSCRIBE, {
    nodeName: string;
    formattedName: string;
}>;
export const blockedUserUnsubscribe = (nodeName: string, formattedName: string): BlockedUserUnsubscribeAction => ({
    type: BLOCKED_USER_UNSUBSCRIBE,
    payload: {nodeName, formattedName}
});

export type BlockDialogAnyAction =
    OpenBlockDialogAction
    | CloseBlockDialogAction
    | BlockDialogSubmitAction
    | BlockDialogSubmittedAction
    | BlockDialogSubmitFailedAction
    | BlockedUserUnfriendAction
    | BlockedUserUnsubscribeAction;

import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { BlockedOperation, BlockedUserInfo } from "api/node/api-types";

export const OPEN_BLOCK_DIALOG = "OPEN_BLOCK_DIALOG";
export type OpenBlockDialogAction = ActionWithPayload<typeof OPEN_BLOCK_DIALOG, {
    nodeName: string;
}>;
export const openBlockDialog = (nodeName: string): OpenBlockDialogAction => ({
    type: OPEN_BLOCK_DIALOG,
    payload: {nodeName}
});

export const CLOSE_BLOCK_DIALOG = "CLOSE_BLOCK_DIALOG";
export type CloseBlockDialogAction = Action<typeof CLOSE_BLOCK_DIALOG>;
export const closeBlockDialog = (): CloseBlockDialogAction => ({
    type: CLOSE_BLOCK_DIALOG
});

export const BLOCK_DIALOG_SUBMIT = "BLOCK_DIALOG_SUBMIT";
export type BlockDialogSubmitAction = ActionWithPayload<typeof BLOCK_DIALOG_SUBMIT, {
    nodeName: string;
    prevBlockedUsers: BlockedUserInfo[];
    blockedOperations: BlockedOperation[];
    deadline: number | null;
}>;
export const blockDialogSubmit = (nodeName: string,
                                  prevBlockedUsers: BlockedUserInfo[],
                                  blockedOperations: BlockedOperation[],
                                  deadline: number | null): BlockDialogSubmitAction => ({
    type: BLOCK_DIALOG_SUBMIT,
    payload: {nodeName, prevBlockedUsers, blockedOperations, deadline}
});

export const BLOCK_DIALOG_SUBMITTED = "BLOCK_DIALOG_SUBMITTED";
export type BlockDialogSubmittedAction = ActionWithPayload<typeof BLOCK_DIALOG_SUBMITTED, {
    nodeName: string;
    blockedUsers: BlockedUserInfo[];
}>;
export const blockDialogSubmitted = (nodeName: string,
                                     blockedUsers: BlockedUserInfo[]): BlockDialogSubmittedAction => ({
    type: BLOCK_DIALOG_SUBMITTED,
    payload: {nodeName, blockedUsers}
});

export const BLOCK_DIALOG_SUBMIT_FAILED = "BLOCK_DIALOG_SUBMIT_FAILED";
export type BlockDialogSubmitFailedAction = Action<typeof BLOCK_DIALOG_SUBMIT_FAILED>;
export const blockDialogSubmitFailed = (): BlockDialogSubmitFailedAction => ({
    type: BLOCK_DIALOG_SUBMIT_FAILED
});

export type BlockDialogAnyAction =
    OpenBlockDialogAction
    | CloseBlockDialogAction
    | BlockDialogSubmitAction
    | BlockDialogSubmittedAction
    | BlockDialogSubmitFailedAction;

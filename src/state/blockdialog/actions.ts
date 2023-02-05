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
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlockedUsers: BlockedUserInfo[];
    blockedOperations: BlockedOperation[];
    deadline: number | null;
    reasonSrc: string;
}>;
export const blockDialogSubmit = (nodeName: string,
                                  entryNodeName: string | null,
                                  entryPostingId: string | null,
                                  prevBlockedUsers: BlockedUserInfo[],
                                  blockedOperations: BlockedOperation[],
                                  deadline: number | null,
                                  reasonSrc: string): BlockDialogSubmitAction => ({
    type: BLOCK_DIALOG_SUBMIT,
    payload: {nodeName, entryNodeName, entryPostingId, prevBlockedUsers, blockedOperations, deadline, reasonSrc}
});

export const BLOCK_DIALOG_SUBMITTED = "BLOCK_DIALOG_SUBMITTED";
export type BlockDialogSubmittedAction = ActionWithPayload<typeof BLOCK_DIALOG_SUBMITTED, {
    nodeName: string;
    entryNodeName: string | null;
    entryPostingId: string | null;
    blockedUsers: BlockedUserInfo[];
}>;
export const blockDialogSubmitted = (nodeName: string,
                                     entryNodeName: string | null,
                                     entryPostingId: string | null,
                                     blockedUsers: BlockedUserInfo[]): BlockDialogSubmittedAction => ({
    type: BLOCK_DIALOG_SUBMITTED,
    payload: {nodeName, entryNodeName, entryPostingId, blockedUsers}
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

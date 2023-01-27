import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

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

export type BlockDialogAnyAction =
    OpenBlockDialogAction
    | CloseBlockDialogAction;

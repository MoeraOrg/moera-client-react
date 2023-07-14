import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { ConfirmBoxButtonAction } from "state/confirmbox/state";

export const CONFIRM_BOX = "CONFIRM_BOX";
export type ConfirmBoxAction = ActionWithPayload<typeof CONFIRM_BOX, {
    message: string;
    yes: string | null;
    no: string | null;
    cancel: string | null;
    onYes: ConfirmBoxButtonAction | null;
    onNo: ConfirmBoxButtonAction | null;
    onCancel: ConfirmBoxButtonAction | null;
    variant: string;
    dontShowAgainBox: boolean;
}>;
export const confirmBox = (message: string, yes: string | null = null, no: string | null = null,
                           onYes: ConfirmBoxButtonAction | null = null, onNo: ConfirmBoxButtonAction | null = null,
                           variant: string = "primary", cancel: string | null = null,
                           onCancel: ConfirmBoxButtonAction | null = null,
                           dontShowAgainBox: boolean = false): ConfirmBoxAction => ({
    type: CONFIRM_BOX,
    payload: {message, yes, no, cancel, onYes, onNo, onCancel, variant, dontShowAgainBox}
});

export const CLOSE_CONFIRM_BOX = "CLOSE_CONFIRM_BOX";
export type CloseConfirmBoxAction = Action<typeof CLOSE_CONFIRM_BOX>;
export const closeConfirmBox = (): CloseConfirmBoxAction => ({
    type: CLOSE_CONFIRM_BOX
});

export type ConfirmBoxAnyAction =
    ConfirmBoxAction
    | CloseConfirmBoxAction;

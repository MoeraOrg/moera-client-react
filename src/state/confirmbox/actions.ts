import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const CONFIRM_BOX = "CONFIRM_BOX";
type ConfirmBoxAction = ActionWithPayload<typeof CONFIRM_BOX, {
    message: string;
    yes: string;
    no: string;
    onYes: any;
    onNo: any;
    variant: string;
}>;
export const confirmBox = (message: string, yes: string = "Yes", no: string = "No", onYes: any = null, onNo: any = null,
                           variant: string = "primary"): ConfirmBoxAction => ({
    type: CONFIRM_BOX,
    payload: {message, yes, no, onYes, onNo, variant}
});

export const CLOSE_CONFIRM_BOX = "CLOSE_CONFIRM_BOX";
type CloseConfirmBoxAction = Action<typeof CLOSE_CONFIRM_BOX>;
export const closeConfirmBox = (): CloseConfirmBoxAction => ({
    type: CLOSE_CONFIRM_BOX
});

export type ConfirmBoxAnyAction =
    ConfirmBoxAction
    | CloseConfirmBoxAction;

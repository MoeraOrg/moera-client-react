import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SheriffOrderReason } from "api/node/api-types";
import { SheriffOrderTarget } from "state/sherifforderdialog/state";

export const OPEN_SHERIFF_ORDER_DIALOG = "OPEN_SHERIFF_ORDER_DIALOG";
export type OpenSheriffOrderDialogAction = ActionWithPayload<typeof OPEN_SHERIFF_ORDER_DIALOG, {
    target: SheriffOrderTarget;
}>;
export const openSheriffOrderDialog = (target: SheriffOrderTarget): OpenSheriffOrderDialogAction => ({
    type: OPEN_SHERIFF_ORDER_DIALOG,
    payload: {target}
});

export const CLOSE_SHERIFF_ORDER_DIALOG = "CLOSE_SHERIFF_ORDER_DIALOG";
export type CloseSheriffOrderDialogAction = Action<typeof CLOSE_SHERIFF_ORDER_DIALOG>;
export const closeSheriffOrderDialog = (): CloseSheriffOrderDialogAction => ({
    type: CLOSE_SHERIFF_ORDER_DIALOG
});

export const SHERIFF_ORDER_DIALOG_SUBMIT = "SHERIFF_ORDER_DIALOG_SUBMIT";
export type SheriffOrderDialogSubmitAction = ActionWithPayload<typeof SHERIFF_ORDER_DIALOG_SUBMIT, {
    target: SheriffOrderTarget;
    reasonCode: SheriffOrderReason;
    reasonDetails: string | null;
    anonymous: boolean;
}>;
export const sheriffOrderDialogSubmit = (target: SheriffOrderTarget, reasonCode: SheriffOrderReason,
                                         reasonDetails: string | null,
                                         anonymous: boolean): SheriffOrderDialogSubmitAction => ({
    type: SHERIFF_ORDER_DIALOG_SUBMIT,
    payload: {target, reasonCode, reasonDetails, anonymous}
});

export const SHERIFF_ORDER_DIALOG_SUBMITTED = "SHERIFF_ORDER_DIALOG_SUBMITTED";
export type SheriffOrderDialogSubmittedAction = Action<typeof SHERIFF_ORDER_DIALOG_SUBMITTED>;
export const sheriffOrderDialogSubmitted = (): SheriffOrderDialogSubmittedAction => ({
    type: SHERIFF_ORDER_DIALOG_SUBMITTED
});

export const SHERIFF_ORDER_DIALOG_SUBMIT_FAILED = "SHERIFF_ORDER_DIALOG_SUBMIT_FAILED";
export type SheriffOrderDialogSubmitFailedAction = Action<typeof SHERIFF_ORDER_DIALOG_SUBMIT_FAILED>;
export const sheriffOrderDialogSubmitFailed = (): SheriffOrderDialogSubmitFailedAction => ({
    type: SHERIFF_ORDER_DIALOG_SUBMIT_FAILED
});

export const SHERIFF_ORDER_DELETE = "SHERIFF_ORDER_DELETE";
export type SheriffOrderDeleteAction = ActionWithPayload<typeof SHERIFF_ORDER_DELETE, {
    target: SheriffOrderTarget;
}>;
export const sheriffOrderDelete = (target: SheriffOrderTarget): SheriffOrderDeleteAction => ({
    type: SHERIFF_ORDER_DELETE,
    payload: {target}
});

export type SheriffOrderDialogAnyAction =
    OpenSheriffOrderDialogAction
    | CloseSheriffOrderDialogAction
    | SheriffOrderDialogSubmitAction
    | SheriffOrderDialogSubmittedAction
    | SheriffOrderDialogSubmitFailedAction
    | SheriffOrderDeleteAction;

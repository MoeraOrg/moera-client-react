import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SheriffOrderReason } from "api";
import { SheriffOrderTarget } from "state/sherifforderdialog/state";

export type OpenSheriffOrderDialogAction = ActionWithPayload<"OPEN_SHERIFF_ORDER_DIALOG", {
    target: SheriffOrderTarget;
}>;
export const openSheriffOrderDialog = (target: SheriffOrderTarget): OpenSheriffOrderDialogAction =>
    actionWithPayload("OPEN_SHERIFF_ORDER_DIALOG", {target});

export type CloseSheriffOrderDialogAction = ActionWithoutPayload<"CLOSE_SHERIFF_ORDER_DIALOG">;
export const closeSheriffOrderDialog = (): CloseSheriffOrderDialogAction =>
    actionWithoutPayload("CLOSE_SHERIFF_ORDER_DIALOG");

export type SheriffOrderDialogSubmitAction = ActionWithPayload<"SHERIFF_ORDER_DIALOG_SUBMIT", {
    target: SheriffOrderTarget;
    reasonCode: SheriffOrderReason;
    reasonDetails: string | null;
    anonymous: boolean;
}>;
export const sheriffOrderDialogSubmit = (
    target: SheriffOrderTarget, reasonCode: SheriffOrderReason, reasonDetails: string | null, anonymous: boolean
): SheriffOrderDialogSubmitAction =>
    actionWithPayload("SHERIFF_ORDER_DIALOG_SUBMIT", {target, reasonCode, reasonDetails, anonymous});

export type SheriffOrderDialogSubmittedAction = ActionWithoutPayload<"SHERIFF_ORDER_DIALOG_SUBMITTED">;
export const sheriffOrderDialogSubmitted = (): SheriffOrderDialogSubmittedAction =>
    actionWithoutPayload("SHERIFF_ORDER_DIALOG_SUBMITTED");

export type SheriffOrderDialogSubmitFailedAction = ActionWithoutPayload<"SHERIFF_ORDER_DIALOG_SUBMIT_FAILED">;
export const sheriffOrderDialogSubmitFailed = (): SheriffOrderDialogSubmitFailedAction =>
    actionWithoutPayload("SHERIFF_ORDER_DIALOG_SUBMIT_FAILED");

export type SheriffOrderDeleteAction = ActionWithPayload<"SHERIFF_ORDER_DELETE", {
    target: SheriffOrderTarget;
}>;
export const sheriffOrderDelete = (target: SheriffOrderTarget): SheriffOrderDeleteAction =>
    actionWithPayload("SHERIFF_ORDER_DELETE", {target});

export type SheriffOrderDialogAnyAction =
    OpenSheriffOrderDialogAction
    | CloseSheriffOrderDialogAction
    | SheriffOrderDialogSubmitAction
    | SheriffOrderDialogSubmittedAction
    | SheriffOrderDialogSubmitFailedAction
    | SheriffOrderDeleteAction;

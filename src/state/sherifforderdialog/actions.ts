import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SheriffOrderReason } from "api/node/api-types";

export const OPEN_SHERIFF_ORDER_DIALOG = "OPEN_SHERIFF_ORDER_DIALOG";
export type OpenSheriffOrderDialogAction = ActionWithPayload<typeof OPEN_SHERIFF_ORDER_DIALOG, {
    nodeName: string;
    fullName: string | null;
    feedName: string;
    postingId: string | null;
    commentId: string | null;
    heading: string;
}>;
export const openSheriffOrderDialog = (nodeName: string, fullName: string | null, feedName: string,
                                       postingId: string | null,
                                       commentId: string | null, heading: string): OpenSheriffOrderDialogAction => ({
    type: OPEN_SHERIFF_ORDER_DIALOG,
    payload: {nodeName, fullName, feedName, postingId, commentId, heading}
});

export const CLOSE_SHERIFF_ORDER_DIALOG = "CLOSE_SHERIFF_ORDER_DIALOG";
export type CloseSheriffOrderDialogAction = Action<typeof CLOSE_SHERIFF_ORDER_DIALOG>;
export const closeSheriffOrderDialog = (): CloseSheriffOrderDialogAction => ({
    type: CLOSE_SHERIFF_ORDER_DIALOG
});

export const SHERIFF_ORDER_DIALOG_SUBMIT = "SHERIFF_ORDER_DIALOG_SUBMIT";
export type SheriffOrderDialogSubmitAction = ActionWithPayload<typeof SHERIFF_ORDER_DIALOG_SUBMIT, {
    nodeName: string;
    feedName: string;
    postingId: string | null;
    commentId: string | null;
    reasonCode: SheriffOrderReason;
    reasonDetails: string | null;
}>;
export const sheriffOrderDialogSubmit = (nodeName: string, feedName: string, postingId: string | null,
                                         commentId: string | null, reasonCode: SheriffOrderReason,
                                         reasonDetails: string | null): SheriffOrderDialogSubmitAction => ({
    type: SHERIFF_ORDER_DIALOG_SUBMIT,
    payload: {nodeName, feedName, postingId, commentId, reasonCode, reasonDetails}
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
    nodeName: string;
    feedName: string;
    postingId: string | null;
    commentId: string | null;
}>;
export const sheriffOrderDelete = (nodeName: string, feedName: string, postingId: string | null,
                                   commentId: string | null): SheriffOrderDeleteAction => ({
    type: SHERIFF_ORDER_DELETE,
    payload: {nodeName, feedName, postingId, commentId}
});

export type SheriffOrderDialogAnyAction =
    OpenSheriffOrderDialogAction
    | CloseSheriffOrderDialogAction
    | SheriffOrderDialogSubmitAction
    | SheriffOrderDialogSubmittedAction
    | SheriffOrderDialogSubmitFailedAction
    | SheriffOrderDeleteAction;

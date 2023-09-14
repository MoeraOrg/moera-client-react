import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SheriffOrderInfo } from "api";

export const OPEN_SHERIFF_ORDER_DETAILS_DIALOG = "OPEN_SHERIFF_ORDER_DETAILS_DIALOG";
export type OpenSheriffOrderDetailsDialogAction = ActionWithPayload<typeof OPEN_SHERIFF_ORDER_DETAILS_DIALOG, {
    nodeName: string;
    id: string;
}>;
export const openSheriffOrderDetailsDialog = (nodeName: string, id: string): OpenSheriffOrderDetailsDialogAction => ({
    type: OPEN_SHERIFF_ORDER_DETAILS_DIALOG,
    payload: {nodeName, id}
});

export const CLOSE_SHERIFF_ORDER_DETAILS_DIALOG = "CLOSE_SHERIFF_ORDER_DETAILS_DIALOG";
export type CloseSheriffOrderDetailsDialogAction = Action<typeof CLOSE_SHERIFF_ORDER_DETAILS_DIALOG>;
export const closeSheriffOrderDetailsDialog = (): CloseSheriffOrderDetailsDialogAction => ({
    type: CLOSE_SHERIFF_ORDER_DETAILS_DIALOG
});

export const SHERIFF_ORDER_DETAILS_DIALOG_LOAD = "SHERIFF_ORDER_DETAILS_DIALOG_LOAD";
export type SheriffOrderDetailsDialogLoadAction = Action<typeof SHERIFF_ORDER_DETAILS_DIALOG_LOAD>;
export const sheriffOrderDetailsDialogLoad = (): SheriffOrderDetailsDialogLoadAction => ({
    type: SHERIFF_ORDER_DETAILS_DIALOG_LOAD
});

export const SHERIFF_ORDER_DETAILS_DIALOG_LOADED = "SHERIFF_ORDER_DETAILS_DIALOG_LOADED";
export type SheriffOrderDetailsDialogLoadedAction = ActionWithPayload<typeof SHERIFF_ORDER_DETAILS_DIALOG_LOADED, {
    info: SheriffOrderInfo;
}>;
export const sheriffOrderDetailsDialogLoaded = (info: SheriffOrderInfo): SheriffOrderDetailsDialogLoadedAction => ({
    type: SHERIFF_ORDER_DETAILS_DIALOG_LOADED,
    payload: {info}
});

export const SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED = "SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED";
export type SheriffOrderDetailsDialogLoadFailedAction = Action<typeof SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED>;
export const sheriffOrderDetailsDialogLoadFailed = (): SheriffOrderDetailsDialogLoadFailedAction => ({
    type: SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED
});

export type SheriffOrderDetailsDialogAnyAction =
    OpenSheriffOrderDetailsDialogAction
    | CloseSheriffOrderDetailsDialogAction
    | SheriffOrderDetailsDialogLoadAction
    | SheriffOrderDetailsDialogLoadedAction
    | SheriffOrderDetailsDialogLoadFailedAction;

import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SheriffOrderInfo } from "api";

export type OpenSheriffOrderDetailsDialogAction = ActionWithPayload<"OPEN_SHERIFF_ORDER_DETAILS_DIALOG", {
    nodeName: string;
    id: string;
}>;
export const openSheriffOrderDetailsDialog = (nodeName: string, id: string): OpenSheriffOrderDetailsDialogAction =>
    actionWithPayload("OPEN_SHERIFF_ORDER_DETAILS_DIALOG", {nodeName, id});

export type CloseSheriffOrderDetailsDialogAction = ActionWithoutPayload<"CLOSE_SHERIFF_ORDER_DETAILS_DIALOG">;
export const closeSheriffOrderDetailsDialog = (): CloseSheriffOrderDetailsDialogAction =>
    actionWithoutPayload("CLOSE_SHERIFF_ORDER_DETAILS_DIALOG");

export type SheriffOrderDetailsDialogLoadAction = ActionWithoutPayload<"SHERIFF_ORDER_DETAILS_DIALOG_LOAD">;
export const sheriffOrderDetailsDialogLoad = (): SheriffOrderDetailsDialogLoadAction =>
    actionWithoutPayload("SHERIFF_ORDER_DETAILS_DIALOG_LOAD");

export type SheriffOrderDetailsDialogLoadedAction = ActionWithPayload<"SHERIFF_ORDER_DETAILS_DIALOG_LOADED", {
    info: SheriffOrderInfo;
}>;
export const sheriffOrderDetailsDialogLoaded = (info: SheriffOrderInfo): SheriffOrderDetailsDialogLoadedAction =>
    actionWithPayload("SHERIFF_ORDER_DETAILS_DIALOG_LOADED", {info});

export type SheriffOrderDetailsDialogLoadFailedAction =
    ActionWithoutPayload<"SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED">;
export const sheriffOrderDetailsDialogLoadFailed = (): SheriffOrderDetailsDialogLoadFailedAction =>
    actionWithoutPayload("SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED");

export type SheriffOrderDetailsDialogAnyAction =
    OpenSheriffOrderDetailsDialogAction
    | CloseSheriffOrderDetailsDialogAction
    | SheriffOrderDetailsDialogLoadAction
    | SheriffOrderDetailsDialogLoadedAction
    | SheriffOrderDetailsDialogLoadFailedAction;

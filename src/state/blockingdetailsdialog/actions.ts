import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { BlockedByUserInfo, BlockedUserInfo } from "api/node/api-types";

export const OPEN_BLOCKING_DETAILS_DIALOG = "OPEN_BLOCKING_DETAILS_DIALOG";
export type OpenBlockingDetailsDialogAction = ActionWithPayload<typeof OPEN_BLOCKING_DETAILS_DIALOG, {
    nodeName: string;
    remoteNodeName: string;
    by: boolean;
}>;
export const openBlockingDetailsDialog = (nodeName: string, remoteNodeName: string,
                                          by: boolean): OpenBlockingDetailsDialogAction => ({
    type: OPEN_BLOCKING_DETAILS_DIALOG,
    payload: {nodeName, remoteNodeName, by}
});

export const CLOSE_BLOCKING_DETAILS_DIALOG = "CLOSE_BLOCKING_DETAILS_DIALOG";
export type CloseBlockingDetailsDialogAction = Action<typeof CLOSE_BLOCKING_DETAILS_DIALOG>;
export const closeBlockingDetailsDialog = (): CloseBlockingDetailsDialogAction => ({
    type: CLOSE_BLOCKING_DETAILS_DIALOG
});

export const BLOCKING_DETAILS_DIALOG_LOAD = "BLOCKING_DETAILS_DIALOG_LOAD";
export type BlockingDetailsDialogLoadAction = Action<typeof BLOCKING_DETAILS_DIALOG_LOAD>;
export const blockingDetailsDialogLoad = (): BlockingDetailsDialogLoadAction => ({
    type: BLOCKING_DETAILS_DIALOG_LOAD
});

export const BLOCKING_DETAILS_DIALOG_LOADED = "BLOCKING_DETAILS_DIALOG_LOADED";
export type BlockingDetailsDialogLoadedAction = ActionWithPayload<typeof BLOCKING_DETAILS_DIALOG_LOADED, {
    blocked: (BlockedUserInfo | BlockedByUserInfo)[];
}>;
export const blockingDetailsDialogLoaded = (
    blocked: (BlockedUserInfo | BlockedByUserInfo)[]
): BlockingDetailsDialogLoadedAction => ({
    type: BLOCKING_DETAILS_DIALOG_LOADED,
    payload: {blocked}
});

export const BLOCKING_DETAILS_DIALOG_LOAD_FAILED = "BLOCKING_DETAILS_DIALOG_LOAD_FAILED";
export type BlockingDetailsDialogLoadFailedAction = Action<typeof BLOCKING_DETAILS_DIALOG_LOAD_FAILED>;
export const blockingDetailsDialogLoadFailed = (): BlockingDetailsDialogLoadFailedAction => ({
    type: BLOCKING_DETAILS_DIALOG_LOAD_FAILED
});

export type BlockingDetailsDialogAnyAction =
    OpenBlockingDetailsDialogAction
    | CloseBlockingDetailsDialogAction
    | BlockingDetailsDialogLoadAction
    | BlockingDetailsDialogLoadedAction
    | BlockingDetailsDialogLoadFailedAction;

import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { BlockedByUserInfo, BlockedUserInfo } from "api";

export type OpenBlockingDetailsDialogAction = ActionWithPayload<"OPEN_BLOCKING_DETAILS_DIALOG", {
    nodeName: string;
    remoteNodeName: string;
    remotePostingId: string | null;
    remotePostingHeading: string | null;
    by: boolean;
}>;
export const openBlockingDetailsDialog = (
    nodeName: string, remoteNodeName: string, remotePostingId: string | null, remotePostingHeading: string | null,
    by: boolean
): OpenBlockingDetailsDialogAction =>
    actionWithPayload(
        "OPEN_BLOCKING_DETAILS_DIALOG",
        {nodeName, remoteNodeName, remotePostingId, remotePostingHeading, by}
    );

export type CloseBlockingDetailsDialogAction = ActionWithoutPayload<"CLOSE_BLOCKING_DETAILS_DIALOG">;
export const closeBlockingDetailsDialog = (): CloseBlockingDetailsDialogAction =>
    actionWithoutPayload("CLOSE_BLOCKING_DETAILS_DIALOG");

export type BlockingDetailsDialogLoadAction = ActionWithoutPayload<"BLOCKING_DETAILS_DIALOG_LOAD">;
export const blockingDetailsDialogLoad = (): BlockingDetailsDialogLoadAction =>
    actionWithoutPayload("BLOCKING_DETAILS_DIALOG_LOAD");

export type BlockingDetailsDialogLoadedAction = ActionWithPayload<"BLOCKING_DETAILS_DIALOG_LOADED", {
    blocked: (BlockedUserInfo | BlockedByUserInfo)[];
}>;
export const blockingDetailsDialogLoaded = (
    blocked: (BlockedUserInfo | BlockedByUserInfo)[]
): BlockingDetailsDialogLoadedAction =>
    actionWithPayload("BLOCKING_DETAILS_DIALOG_LOADED", {blocked});

export type BlockingDetailsDialogLoadFailedAction = ActionWithoutPayload<"BLOCKING_DETAILS_DIALOG_LOAD_FAILED">;
export const blockingDetailsDialogLoadFailed = (): BlockingDetailsDialogLoadFailedAction =>
    actionWithoutPayload("BLOCKING_DETAILS_DIALOG_LOAD_FAILED");

export type BlockingDetailsDialogAnyAction =
    OpenBlockingDetailsDialogAction
    | CloseBlockingDetailsDialogAction
    | BlockingDetailsDialogLoadAction
    | BlockingDetailsDialogLoadedAction
    | BlockingDetailsDialogLoadFailedAction;

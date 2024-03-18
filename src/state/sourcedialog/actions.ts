import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";

export type OpenSourceDialogAction = ActionWithPayload<"OPEN_SOURCE_DIALOG", {
    nodeName: RelNodeName | string;
    postingId: string;
    commentId: string | null;
}>;
export const openSourceDialog = (
    nodeName: RelNodeName | string, postingId: string, commentId?: string | null
): OpenSourceDialogAction =>
    actionWithPayload("OPEN_SOURCE_DIALOG", {nodeName, postingId, commentId: commentId ?? null});

export type CloseSourceDialogAction = ActionWithoutPayload<"CLOSE_SOURCE_DIALOG">;
export const closeSourceDialog = (): CloseSourceDialogAction =>
    actionWithoutPayload("CLOSE_SOURCE_DIALOG");

export type SourceDialogLoadedAction = ActionWithPayload<"SOURCE_DIALOG_LOADED", {
    text: string;
}>;
export const sourceDialogLoaded = (text: string): SourceDialogLoadedAction =>
    actionWithPayload("SOURCE_DIALOG_LOADED", {text});

export type SourceDialogLoadFailedAction = ActionWithoutPayload<"SOURCE_DIALOG_LOAD_FAILED">;
export const sourceDialogLoadFailed = (): SourceDialogLoadFailedAction =>
    actionWithoutPayload("SOURCE_DIALOG_LOAD_FAILED");

export type SourceDialogAnyAction =
    OpenSourceDialogAction
    | CloseSourceDialogAction
    | SourceDialogLoadedAction
    | SourceDialogLoadFailedAction;

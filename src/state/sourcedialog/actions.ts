import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const OPEN_SOURCE_DIALOG = "OPEN_SOURCE_DIALOG";
type OpenSourceDialogAction = ActionWithPayload<typeof OPEN_SOURCE_DIALOG, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const openSourceDialog = (nodeName: string, postingId: string,
                                 commentId: string | null): OpenSourceDialogAction => ({
    type: OPEN_SOURCE_DIALOG,
    payload: {nodeName, postingId, commentId}
});

export const CLOSE_SOURCE_DIALOG = "CLOSE_SOURCE_DIALOG";
type CloseSourceDialogAction = Action<typeof CLOSE_SOURCE_DIALOG>;
export const closeSourceDialog = (): CloseSourceDialogAction => ({
    type: CLOSE_SOURCE_DIALOG
});

export const SOURCE_DIALOG_LOADED = "SOURCE_DIALOG_LOADED";
type SourceDialogLoadedAction = ActionWithPayload<typeof SOURCE_DIALOG_LOADED, {
    text: string;
}>;
export const sourceDialogLoaded = (text: string): SourceDialogLoadedAction => ({
    type: SOURCE_DIALOG_LOADED,
    payload: {text}
});

export const SOURCE_DIALOG_LOAD_FAILED = "SOURCE_DIALOG_LOAD_FAILED";
type SourceDialogLoadFailedAction = Action<typeof SOURCE_DIALOG_LOAD_FAILED>;
export const sourceDialogLoadFailed = (): SourceDialogLoadFailedAction => ({
    type: SOURCE_DIALOG_LOAD_FAILED
});

export type SourceDialogAnyAction =
    OpenSourceDialogAction
    | CloseSourceDialogAction
    | SourceDialogLoadedAction
    | SourceDialogLoadFailedAction;

import { ActionBase } from "state/action-base";

export const OPEN_SOURCE_DIALOG = "OPEN_SOURCE_DIALOG";
type OpenSourceDialogAction = ActionBase<typeof OPEN_SOURCE_DIALOG, {
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
type CloseSourceDialogAction = ActionBase<typeof CLOSE_SOURCE_DIALOG, never>;
export const closeSourceDialog = (): CloseSourceDialogAction => ({
    type: CLOSE_SOURCE_DIALOG
});

export const SOURCE_DIALOG_LOADED = "SOURCE_DIALOG_LOADED";
type SourceDialogLoadedAction = ActionBase<typeof SOURCE_DIALOG_LOADED, {
    text: string;
}>;
export const sourceDialogLoaded = (text: string): SourceDialogLoadedAction => ({
    type: SOURCE_DIALOG_LOADED,
    payload: {text}
});

export const SOURCE_DIALOG_LOAD_FAILED = "SOURCE_DIALOG_LOAD_FAILED";
type SourceDialogLoadFailedAction = ActionBase<typeof SOURCE_DIALOG_LOAD_FAILED, never>;
export const sourceDialogLoadFailed = (): SourceDialogLoadFailedAction => ({
    type: SOURCE_DIALOG_LOAD_FAILED
});

export type SourceDialogAnyAction =
    OpenSourceDialogAction
    | CloseSourceDialogAction
    | SourceDialogLoadedAction
    | SourceDialogLoadFailedAction;

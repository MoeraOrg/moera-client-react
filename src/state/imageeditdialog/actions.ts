import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { PostingText, PrivateMediaFileInfo } from "api";

export const OPEN_IMAGE_EDIT_DIALOG = "OPEN_IMAGE_EDIT_DIALOG";
export type OpenImageEditDialogAction = ActionWithPayload<typeof OPEN_IMAGE_EDIT_DIALOG, {
    nodeName: string | null;
    media: PrivateMediaFileInfo;
}>;
export const openImageEditDialog = (nodeName: string | null,
                                    media: PrivateMediaFileInfo): OpenImageEditDialogAction => ({
    type: OPEN_IMAGE_EDIT_DIALOG,
    payload: {nodeName, media}
});

export const CLOSE_IMAGE_EDIT_DIALOG = "CLOSE_IMAGE_EDIT_DIALOG";
export type CloseImageEditDialogAction = Action<typeof CLOSE_IMAGE_EDIT_DIALOG>;
export const closeImageEditDialog = (): CloseImageEditDialogAction => ({
    type: CLOSE_IMAGE_EDIT_DIALOG
});

export const IMAGE_EDIT_DIALOG_LOAD = "IMAGE_EDIT_DIALOG_LOAD";
export type ImageEditDialogLoadAction = Action<typeof IMAGE_EDIT_DIALOG_LOAD>;
export const imageEditDialogLoad = (): ImageEditDialogLoadAction => ({
    type: IMAGE_EDIT_DIALOG_LOAD
});

export const IMAGE_EDIT_DIALOG_LOADED = "IMAGE_EDIT_DIALOG_LOADED";
export type ImageEditDialogLoadedAction = Action<typeof IMAGE_EDIT_DIALOG_LOADED>;
export const imageEditDialogLoaded = (): ImageEditDialogLoadedAction => ({
    type: IMAGE_EDIT_DIALOG_LOADED
});

export const IMAGE_EDIT_DIALOG_LOAD_FAILED = "IMAGE_EDIT_DIALOG_LOAD_FAILED";
export type ImageEditDialogLoadFailedAction = Action<typeof IMAGE_EDIT_DIALOG_LOAD_FAILED>;
export const imageEditDialogLoadFailed = (): ImageEditDialogLoadFailedAction => ({
    type: IMAGE_EDIT_DIALOG_LOAD_FAILED
});

export const IMAGE_EDIT_DIALOG_POST = "IMAGE_EDIT_DIALOG_POST";
export type ImageEditDialogPostAction = ActionWithPayload<typeof IMAGE_EDIT_DIALOG_POST, {
    postingText: PostingText;
}>;
export const imageEditDialogPost = (postingText: PostingText): ImageEditDialogPostAction => ({
    type: IMAGE_EDIT_DIALOG_POST,
    payload: {postingText}
});

export const IMAGE_EDIT_DIALOG_POST_SUCCEEDED = "IMAGE_EDIT_DIALOG_POST_SUCCEEDED";
export type ImageEditDialogPostSucceededAction = Action<typeof IMAGE_EDIT_DIALOG_POST_SUCCEEDED>;
export const imageEditDialogPostSucceeded = (): ImageEditDialogPostSucceededAction => ({
    type: IMAGE_EDIT_DIALOG_POST_SUCCEEDED
});

export const IMAGE_EDIT_DIALOG_POST_FAILED = "IMAGE_EDIT_DIALOG_POST_FAILED";
export type ImageEditDialogPostFailedAction = Action<typeof IMAGE_EDIT_DIALOG_POST_FAILED>;
export const imageEditDialogPostFailed = (): ImageEditDialogPostFailedAction => ({
    type: IMAGE_EDIT_DIALOG_POST_FAILED
});

export type ImageEditDialogAnyAction =
    OpenImageEditDialogAction
    | CloseImageEditDialogAction
    | ImageEditDialogLoadAction
    | ImageEditDialogLoadedAction
    | ImageEditDialogLoadFailedAction
    | ImageEditDialogPostAction
    | ImageEditDialogPostSucceededAction
    | ImageEditDialogPostFailedAction;

import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { PostingText, PrivateMediaFileInfo } from "api";
import { RelNodeName } from "util/rel-node-name";

export type OpenImageEditDialogAction = ActionWithPayload<"OPEN_IMAGE_EDIT_DIALOG", {
    nodeName: RelNodeName | string;
    media: PrivateMediaFileInfo;
}>;
export const openImageEditDialog = (
    nodeName: RelNodeName | string, media: PrivateMediaFileInfo
): OpenImageEditDialogAction =>
    actionWithPayload("OPEN_IMAGE_EDIT_DIALOG", {nodeName, media});

export type CloseImageEditDialogAction = ActionWithoutPayload<"CLOSE_IMAGE_EDIT_DIALOG">;
export const closeImageEditDialog = (): CloseImageEditDialogAction =>
    actionWithoutPayload("CLOSE_IMAGE_EDIT_DIALOG");

export type ImageEditDialogLoadAction = ActionWithoutPayload<"IMAGE_EDIT_DIALOG_LOAD">;
export const imageEditDialogLoad = (): ImageEditDialogLoadAction =>
    actionWithoutPayload("IMAGE_EDIT_DIALOG_LOAD");

export type ImageEditDialogLoadedAction = ActionWithoutPayload<"IMAGE_EDIT_DIALOG_LOADED">;
export const imageEditDialogLoaded = (): ImageEditDialogLoadedAction =>
    actionWithoutPayload("IMAGE_EDIT_DIALOG_LOADED");

export type ImageEditDialogLoadFailedAction = ActionWithoutPayload<"IMAGE_EDIT_DIALOG_LOAD_FAILED">;
export const imageEditDialogLoadFailed = (): ImageEditDialogLoadFailedAction =>
    actionWithoutPayload("IMAGE_EDIT_DIALOG_LOAD_FAILED");

export type ImageEditDialogPostAction = ActionWithPayload<"IMAGE_EDIT_DIALOG_POST", {
    postingText: PostingText;
}>;
export const imageEditDialogPost = (postingText: PostingText): ImageEditDialogPostAction =>
    actionWithPayload("IMAGE_EDIT_DIALOG_POST", {postingText});

export type ImageEditDialogPostSucceededAction = ActionWithoutPayload<"IMAGE_EDIT_DIALOG_POST_SUCCEEDED">;
export const imageEditDialogPostSucceeded = (): ImageEditDialogPostSucceededAction =>
    actionWithoutPayload("IMAGE_EDIT_DIALOG_POST_SUCCEEDED");

export type ImageEditDialogPostFailedAction = ActionWithoutPayload<"IMAGE_EDIT_DIALOG_POST_FAILED">;
export const imageEditDialogPostFailed = (): ImageEditDialogPostFailedAction =>
    actionWithoutPayload("IMAGE_EDIT_DIALOG_POST_FAILED");

export type ImageEditDialogAnyAction =
    OpenImageEditDialogAction
    | CloseImageEditDialogAction
    | ImageEditDialogLoadAction
    | ImageEditDialogLoadedAction
    | ImageEditDialogLoadFailedAction
    | ImageEditDialogPostAction
    | ImageEditDialogPostSucceededAction
    | ImageEditDialogPostFailedAction;

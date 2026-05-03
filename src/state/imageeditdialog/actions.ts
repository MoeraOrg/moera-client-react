import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { MediaFileWithCaption } from "ui/control/richtexteditor";
import { RelNodeName } from "util/rel-node-name";

export type OpenImageEditDialogAction = ActionWithPayload<"OPEN_IMAGE_EDIT_DIALOG", {
    nodeName: RelNodeName | string;
    media: MediaFileWithCaption;
    parentOverlayId: string | undefined;
}>;
export const openImageEditDialog = (
    nodeName: RelNodeName | string, media: MediaFileWithCaption, parentOverlayId: string | undefined
): OpenImageEditDialogAction =>
    actionWithPayload("OPEN_IMAGE_EDIT_DIALOG", {nodeName, media, parentOverlayId});

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

export type ImageEditDialogAnyAction =
    OpenImageEditDialogAction
    | CloseImageEditDialogAction
    | ImageEditDialogLoadAction
    | ImageEditDialogLoadedAction
    | ImageEditDialogLoadFailedAction;

import { PrivateMediaFileInfo } from "api";
import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type OpenMediaDownloadDialogAction = ActionWithPayload<"OPEN_MEDIA_DOWNLOAD_DIALOG", {
    nodeName: string;
    mediaId: string;
    grant: string | null;
}>;
export const openMediaDownloadDialog = (
    nodeName: string, mediaId: string, grant: string | null
): OpenMediaDownloadDialogAction =>
    actionWithPayload("OPEN_MEDIA_DOWNLOAD_DIALOG", {nodeName, mediaId, grant});

export type CloseMediaDownloadDialogAction = ActionWithoutPayload<"CLOSE_MEDIA_DOWNLOAD_DIALOG">;
export const closeMediaDownloadDialog = (): CloseMediaDownloadDialogAction =>
    actionWithoutPayload("CLOSE_MEDIA_DOWNLOAD_DIALOG");

export type MediaDownloadSucceededAction = ActionWithPayload<"MEDIA_DOWNLOAD_SUCCEEDED", {
    nodeName: string;
    mediaId: string;
    media: PrivateMediaFileInfo;
}>;
export const mediaDownloadSucceeded = (
    nodeName: string, mediaId: string, media: PrivateMediaFileInfo
): MediaDownloadSucceededAction =>
    actionWithPayload("MEDIA_DOWNLOAD_SUCCEEDED", {nodeName, mediaId, media});

export type MediaDownloadFailedAction = ActionWithPayload<"MEDIA_DOWNLOAD_FAILED", {
    nodeName: string;
    mediaId: string;
    errorCode: string;
}>;
export const mediaDownloadFailed = (nodeName: string, mediaId: string, errorCode: string): MediaDownloadFailedAction =>
    actionWithPayload("MEDIA_DOWNLOAD_FAILED", {nodeName, mediaId, errorCode});

export type MediaDownloadDialogAnyAction =
    OpenMediaDownloadDialogAction
    | CloseMediaDownloadDialogAction
    | MediaDownloadSucceededAction
    | MediaDownloadFailedAction;

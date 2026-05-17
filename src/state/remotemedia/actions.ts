import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import type { PrivateMediaFileInfo } from "api";
import type { RemoteMediaData } from "storage";

export type RemoteMediaLoadAction = ActionWithPayload<"REMOTE_MEDIA_LOAD", {
    nodeName: string;
    mediaId: string;
    grant: string | null;
}>;
export const remoteMediaLoad = (
    nodeName: string, mediaId: string, grant: string | null = null
): RemoteMediaLoadAction =>
    actionWithPayload("REMOTE_MEDIA_LOAD", {nodeName, mediaId, grant});

export type RemoteMediaLoadedAction = ActionWithPayload<"REMOTE_MEDIA_LOADED", {
    nodeName: string;
    mediaId: string;
    media: PrivateMediaFileInfo;
}>;
export const remoteMediaLoaded = (
    nodeName: string, mediaId: string, media: PrivateMediaFileInfo
): RemoteMediaLoadedAction =>
    actionWithPayload("REMOTE_MEDIA_LOADED", {nodeName, mediaId, media});

export type RemoteMediaLoadFailedAction = ActionWithPayload<"REMOTE_MEDIA_LOAD_FAILED", {
    nodeName: string;
    mediaId: string;
}>;
export const remoteMediaLoadFailed = (nodeName: string, mediaId: string): RemoteMediaLoadFailedAction =>
    actionWithPayload("REMOTE_MEDIA_LOAD_FAILED", {nodeName, mediaId});

export type RemoteMediaMaintenanceAction = ActionWithoutPayload<"REMOTE_MEDIA_MAINTENANCE">;
export const remoteMediaMaintenance = (): RemoteMediaMaintenanceAction =>
    actionWithoutPayload("REMOTE_MEDIA_MAINTENANCE");

export type RemoteMediaPopulateAction = ActionWithPayload<"REMOTE_MEDIA_POPULATE", {
    remoteMedia: RemoteMediaData;
}>;
export const remoteMediaPopulate = (remoteMedia: RemoteMediaData): RemoteMediaPopulateAction =>
    actionWithPayload("REMOTE_MEDIA_POPULATE", {remoteMedia});

export type RemoteMediaAnyAction =
    RemoteMediaLoadAction
    | RemoteMediaLoadedAction
    | RemoteMediaLoadFailedAction
    | RemoteMediaMaintenanceAction
    | RemoteMediaPopulateAction;

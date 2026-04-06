import { trigger } from "state/trigger";
import { EventAction, RemoteMediaDownloadFailedEvent, RemoteMediaDownloadedEvent } from "api/events";
import { mediaDownloadFailed, mediaDownloadSucceeded } from "state/mediadownloaddialog/actions";

export default [
    trigger(
        "EVENT_HOME_REMOTE_MEDIA_DOWNLOADED",
        true,
        (signal: EventAction<RemoteMediaDownloadedEvent>) =>
            mediaDownloadSucceeded(signal.payload.nodeName, signal.payload.mediaId, signal.payload.media)
    ),
    trigger(
        "EVENT_HOME_REMOTE_MEDIA_DOWNLOAD_FAILED",
        true,
        (signal: EventAction<RemoteMediaDownloadFailedEvent>) =>
            mediaDownloadFailed(signal.payload.nodeName, signal.payload.mediaId, signal.payload.errorCode)
    )
];

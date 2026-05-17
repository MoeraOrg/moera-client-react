import { addDays, getUnixTime } from 'date-fns';

import { MediaAttachment, Node, StoryInfo } from "api";
import { Storage } from "storage";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { saga } from "state/saga";
import {
    remoteMediaLoad,
    RemoteMediaLoadAction,
    remoteMediaLoaded,
    remoteMediaLoadFailed
} from "state/remotemedia/actions";
import { isRemoteMediaToBeLoaded } from "state/remotemedia/selectors";
import { dispatch, select } from "state/store-sagas";

export default [
    saga("REMOTE_MEDIA_LOAD", payload => `${payload.nodeName}/${payload.mediaId}`, remoteMediaLoadSaga),
    saga("REMOTE_MEDIA_LOADED", null, remoteMediaLoadedSaga),
    saga("REMOTE_MEDIA_MAINTENANCE", "", remoteMediaMaintenanceSaga)
];

async function remoteMediaLoadSaga(action: WithContext<RemoteMediaLoadAction>): Promise<void> {
    const {nodeName, mediaId, grant} = action.payload;

    try {
        const media = await Node.getPrivateMediaInfo(action, nodeName, mediaId, grant);
        if (media.grantExpiresAt == null) {
            media.grantExpiresAt = getUnixTime(addDays(new Date(), 7));
        }
        dispatch(remoteMediaLoaded(nodeName, mediaId, media).causedBy(action));
    } catch (e) {
        dispatch(remoteMediaLoadFailed(nodeName, mediaId).causedBy(action));
    }
}

function remoteMediaLoadedSaga(): void {
    storeRemoteMedia();
}

function remoteMediaMaintenanceSaga(): void {
    storeRemoteMedia();
}

function storeRemoteMedia(): void {
    Storage.storeRemoteMedia(select(state => state.remoteMedia));
}

function loadRemoteMediaInAttachments(
    action: WithContext<ClientAction>, attachments: MediaAttachment[] | null | undefined
): void {
    if (attachments == null) {
        return;
    }

    for (const attachment of attachments) {
        const {media, remoteMedia} = attachment;
        if (media != null || remoteMedia?.nodeName == null) {
            continue;
        }

        const toBeLoaded = select(state => isRemoteMediaToBeLoaded(state, remoteMedia.nodeName, remoteMedia.mediaId));
        if (!toBeLoaded) {
            continue;
        }

        dispatch(remoteMediaLoad(
            remoteMedia.nodeName, remoteMedia.mediaId, remoteMedia.grant ?? null
        ).causedBy(action));
    }
}

interface EntryWithMedia {
    media?: MediaAttachment[] | null;
}

export function loadRemoteMediaInEntry(
    action: WithContext<ClientAction>, entry: EntryWithMedia | null | undefined
): void {
    if (entry != null) {
        loadRemoteMediaInAttachments(action, entry.media);
    }
}

export function loadRemoteMediaInEntries(
    action: WithContext<ClientAction>, entries: EntryWithMedia[] | null | undefined
): void {
    if (entries == null) {
        return;
    }

    for (const entry of entries) {
        loadRemoteMediaInEntry(action, entry);
    }
}

export function loadRemoteMediaInStories(
    action: WithContext<ClientAction>, stories: StoryInfo[] | null | undefined
): void {
    if (stories == null) {
        return;
    }

    for (const story of stories) {
        loadRemoteMediaInEntry(action, story.posting);
        loadRemoteMediaInEntry(action, story.comment);
    }
}

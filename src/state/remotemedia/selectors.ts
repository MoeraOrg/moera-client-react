import { RemoteMediaStatus } from "state/remotemedia/state";
import { ClientState } from "state/state";
import { PrivateMediaFileInfo } from "api";

function getRemoteMediaStatus(state: ClientState, nodeName: string, mediaId: string): RemoteMediaStatus | null {
    return state.remoteMedia[nodeName]?.[mediaId] ?? null;
}

export function isRemoteMediaToBeLoaded(state: ClientState, nodeName: string, mediaId: string): boolean {
    const status = getRemoteMediaStatus(state, nodeName, mediaId);
    return status == null || (!status.loaded && !status.loading);
}

export function getRemoteMedia(
    state: ClientState,
    nodeName: string | null | undefined,
    mediaId: string | null | undefined,
    digest: string | null | undefined
): PrivateMediaFileInfo | null {
    if (nodeName == null || mediaId == null) {
        return null;
    }

    const status = getRemoteMediaStatus(state, nodeName, mediaId);
    return status?.loaded && (digest == null || status.media?.digest === digest) ? status.media : null;
}

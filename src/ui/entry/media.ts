import { useSelector } from 'react-redux';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getRemoteMedia } from "state/remotemedia/selectors";
import { RelNodeName } from "util/rel-node-name";
import { mediaImageRect, mediaImageTagAttributes, MediaImageTagAttributes } from "util/media-images";
import { resolveMediaUrl } from "util/media-url";
import { toInt } from "util/misc";

export interface ActualMedia {
    mediaId: string | undefined;
    actualNodeName: string | RelNodeName;
    actualRootPage: string | null;
    actualMediaFile: PrivateMediaFileInfo | null;
}

export function useActualMedia(
    nodeName: RelNodeName | string,
    mediaFile: PrivateMediaFileInfo | null,
    remoteMedia: Omit<RemoteMediaInfo, "id"> | null
): ActualMedia {
    const mediaId = mediaFile?.id ?? remoteMedia?.mediaId;
    const actualNodeName = (mediaFile != null ? nodeName : remoteMedia?.nodeName) ?? nodeName;
    const actualRootPage = useSelector((state: ClientState) => getNamingNameRoot(state, actualNodeName));
    const remoteMediaFile = useSelector((state: ClientState) =>
        getRemoteMedia(state, remoteMedia?.nodeName, remoteMedia?.mediaId, remoteMedia?.digest)
    );
    const actualMediaFile = mediaFile ?? remoteMediaFile;

    return {mediaId, actualNodeName, actualRootPage, actualMediaFile};
}

export function useMediaPreviewAttributes(
    nodeName: RelNodeName | string,
    mediaFile: PrivateMediaFileInfo | null,
    remoteMedia: Omit<RemoteMediaInfo, "id"> | null,
    width?: string | number | null,
    height?: string | number | null
): Omit<MediaImageTagAttributes, "src"> & {src: string | null} {
    const {actualRootPage, actualMediaFile} = useActualMedia(nodeName, mediaFile, remoteMedia);
    let targetWidth = Math.max(toInt(width), toInt(height));
    targetWidth = targetWidth === 0 ? 900 : targetWidth;
    if (actualMediaFile != null) {
        return mediaImageTagAttributes(actualRootPage, actualMediaFile, targetWidth, width, height);
    }

    const [imageWidth, imageHeight] = mediaImageRect(width, height, remoteMedia?.width, remoteMedia?.height, false);
    return {
        src: null,
        srcSet: "",
        sizes: "",
        width: imageWidth,
        height: imageHeight,
    }
}

export function useMediaPath(
    nodeName: RelNodeName | string,
    mediaFile: PrivateMediaFileInfo | null,
    remoteMedia: Omit<RemoteMediaInfo, "id"> | null
): string | undefined {
    const {actualRootPage, actualMediaFile} = useActualMedia(nodeName, mediaFile, remoteMedia);
    const path = actualMediaFile?.directPath ?? actualMediaFile?.path;

    return path != null ? resolveMediaUrl(actualRootPage, path) : undefined;
}

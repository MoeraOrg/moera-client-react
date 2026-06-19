import { useSelector } from 'react-redux';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getRemoteMedia } from "state/remotemedia/selectors";
import { RelNodeName } from "util/rel-node-name";
import { mediaImageRect, mediaImageTagAttributes, MediaImageTagAttributes } from "util/media-images";

export function useMediaAttributes(
    nodeName: RelNodeName | string,
    mediaFile: PrivateMediaFileInfo | null,
    remoteMedia: Omit<RemoteMediaInfo, "id"> | null,
    width?: string | number | null,
    height?: string | number | null
): Omit<MediaImageTagAttributes, "src"> & {src: string | null} {
    const actualNodeName = (mediaFile != null ? nodeName : remoteMedia?.nodeName) ?? nodeName;
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, actualNodeName));
    const remoteMediaFile = useSelector((state: ClientState) =>
        getRemoteMedia(state, remoteMedia?.nodeName, remoteMedia?.mediaId, remoteMedia?.digest)
    );

    const actualMediaFile = mediaFile ?? remoteMediaFile;
    if (actualMediaFile != null) {
        return mediaImageTagAttributes(rootPage, actualMediaFile, 900, width, height);
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

import { Node } from "api";
import {
    LinkPreviewImageLeaseAction,
    linkPreviewImageLeased,
    linkPreviewImageLeaseFailed,
    LinkPreviewLoadAction,
    linkPreviewLoaded,
    linkPreviewLoadFailed
} from "state/linkpreviews/actions";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { saga } from "state/saga";
import { remoteMediaLoaded } from "state/remotemedia/actions";
import { getLinkPreviewInfo } from "state/linkpreviews/selectors";
import { localMediaToLeasedRemoteMediaInfo } from "ui/control/richtexteditor";
import { REL_HOME } from "util/rel-node-name";
import { MediaWithCaption } from "util/media-with-caption";

export default [
    saga("LINK_PREVIEW_LOAD", payload => payload.url, linkPreviewLoadSaga),
    saga("LINK_PREVIEW_IMAGE_LEASE", payload => payload.url, linkPreviewImageLeaseSaga)
];

async function linkPreviewLoadSaga(action: WithContext<LinkPreviewLoadAction>): Promise<void> {
    const {url} = action.payload;
    try {
        const info = await Node.createLinkPreview(action, REL_HOME, url);
        info.url = url; // canonical URL may differ, so we should force consistency throughout the app
        dispatch(linkPreviewLoaded(url, info).causedBy(action));
    } catch {
        dispatch(linkPreviewLoadFailed(url).causedBy(action));
    }
}

async function linkPreviewImageLeaseSaga(action: WithContext<LinkPreviewImageLeaseAction>): Promise<void> {
    const {url, nodeName} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        dispatch(linkPreviewImageLeaseFailed(url, nodeName).causedBy(action));
        return;
    }

    const mediaFile = select(state => getLinkPreviewInfo(state, url)?.image);
    if (mediaFile == null) {
        dispatch(linkPreviewImageLeaseFailed(url, nodeName).causedBy(action));
        return;
    }

    try {
        let mediaFileWithCaption: MediaWithCaption;
        if (nodeName === homeOwnerName) {
            mediaFileWithCaption = new MediaWithCaption(mediaFile);
        } else {
            const lease = await Node.createMediaLease(action, REL_HOME, {nodeName, mediaId: mediaFile.id});
            const remoteMedia = localMediaToLeasedRemoteMediaInfo(mediaFile, homeOwnerName, lease.id);
            if (remoteMedia != null) {
                dispatch(remoteMediaLoaded(remoteMedia.nodeName, remoteMedia.mediaId, mediaFile).causedBy(action));
            }
            mediaFileWithCaption = new MediaWithCaption(undefined, remoteMedia);
        }
        dispatch(linkPreviewImageLeased(url, nodeName, mediaFileWithCaption).causedBy(action));
    } catch {
        dispatch(linkPreviewImageLeaseFailed(url, nodeName).causedBy(action));
    }
}

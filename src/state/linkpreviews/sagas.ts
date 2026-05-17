import { Node } from "api";
import { mediaUpload } from "api/node/media-upload";
import {
    LinkPreviewImageUploadAction,
    linkPreviewImageUploaded,
    linkPreviewImageUploadFailed,
    LinkPreviewLoadAction,
    linkPreviewLoaded,
    linkPreviewLoadFailed
} from "state/linkpreviews/actions";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { saga } from "state/saga";
import { remoteMediaLoaded } from "state/remotemedia/actions";
import { getLinkPreviewInfo } from "state/linkpreviews/selectors";
import { getSettingNode } from "state/settings/selectors";
import { localMediaToLeasedRemoteMediaInfo } from "ui/control/richtexteditor";
import { randomId } from "util/ui";
import { REL_HOME } from "util/rel-node-name";
import { MediaWithCaption } from "util/media-with-caption";

export default [
    saga("LINK_PREVIEW_LOAD", payload => payload.url, linkPreviewLoadSaga),
    saga("LINK_PREVIEW_IMAGE_UPLOAD", payload => payload.url, linkPreviewImageUploadSaga)
];

async function linkPreviewLoadSaga(action: WithContext<LinkPreviewLoadAction>): Promise<void> {
    const {url} = action.payload;
    try {
        const info = await Node.proxyLinkPreview(action, REL_HOME, url);
        info.imageUrl = resolveImageUrl(info.imageUrl, info.url ?? url);
        info.url = url; // canonical URL may differ, so we should force consistency throughout the app
        dispatch(linkPreviewLoaded(url, info).causedBy(action));
    } catch {
        dispatch(linkPreviewLoadFailed(url).causedBy(action));
    }
}

function resolveImageUrl(imageUrl: string | null | undefined, pageUrl: string): string | null {
    if (imageUrl == null) {
        return null;
    }

    try {
        return new URL(imageUrl).toString();
    } catch {
        // Image URL is not absolute
    }

    try {
        return new URL(imageUrl, pageUrl).toString();
    } catch {
        return imageUrl;
    }
}

async function linkPreviewImageUploadSaga(action: WithContext<LinkPreviewImageUploadAction>): Promise<void> {
    const {url, nodeName, features} = action.payload;
    const {ownerName, homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        return;
    }

    const imageUrl = select(state => getLinkPreviewInfo(state, url)?.imageUrl);
    if (imageUrl == null) {
        dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        return;
    }

    const mediaMaxSize = select(state => getSettingNode(state, "media.max-size") as number);

    try {
        const blob = await Node.proxyMedia(action, REL_HOME, imageUrl);
        const file = new File([blob], `moera-lp-${randomId()}.img`, {type: blob.type});
        const mediaFile = await mediaUpload(action, features, mediaMaxSize, homeOwnerName, file, true);
        if (mediaFile != null) {
            let mediaFileWithCaption: MediaWithCaption;
            if (ownerName === homeOwnerName || ownerName == null) {
                mediaFileWithCaption = new MediaWithCaption(mediaFile);
            } else {
                const lease = await Node.createMediaLease(
                    action, REL_HOME, {nodeName: ownerName, mediaId: mediaFile.id}
                );
                const remoteMedia = localMediaToLeasedRemoteMediaInfo(mediaFile, homeOwnerName, lease.id);
                if (remoteMedia != null) {
                    dispatch(remoteMediaLoaded(remoteMedia.nodeName, remoteMedia.mediaId, mediaFile).causedBy(action));
                }
                mediaFileWithCaption = new MediaWithCaption(undefined, remoteMedia);
            }
            dispatch(linkPreviewImageUploaded(url, nodeName, mediaFileWithCaption).causedBy(action));
        } else {
            dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        }
    } catch {
        dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
    }
}

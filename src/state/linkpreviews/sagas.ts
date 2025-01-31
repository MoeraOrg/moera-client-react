import { Node } from "api";
import { imageUpload } from "api/node/images-upload";
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
import { executor } from "state/executor";
import { getLinkPreviewInfo } from "state/linkpreviews/selectors";
import { randomId } from "util/ui";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("LINK_PREVIEW_LOAD", payload => payload.url, linkPreviewLoadSaga),
    executor("LINK_PREVIEW_IMAGE_UPLOAD", payload => payload.url, linkPreviewImageUploadSaga)
];

async function linkPreviewLoadSaga(action: WithContext<LinkPreviewLoadAction>): Promise<void> {
    const {url} = action.payload;
    try {
        const info = await Node.proxyLinkPreview(action, REL_HOME, url);
        info.url = url; // canonical URL may differ, so we should force consistency throughout the app
        dispatch(linkPreviewLoaded(url, info).causedBy(action));
    } catch (e) {
        dispatch(linkPreviewLoadFailed(url).causedBy(action));
    }
}

async function linkPreviewImageUploadSaga(action: WithContext<LinkPreviewImageUploadAction>): Promise<void> {
    const {url, nodeName, features} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        return;
    }

    const imageUrl = select(state => getLinkPreviewInfo(state, url)?.imageUrl);
    if (imageUrl == null) {
        dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        return;
    }

    try {
        const blob = await Node.proxyMedia(action, REL_HOME, imageUrl);
        const file = new File([blob], `moera-lp-${randomId()}.img`, {type: blob.type});
        const mediaFile = await imageUpload(action, features, nodeName, homeOwnerName, file, true);
        if (mediaFile != null) {
            dispatch(linkPreviewImageUploaded(url, nodeName, mediaFile).causedBy(action));
        } else {
            dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        }
    } catch (e) {
        dispatch(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
    }
}

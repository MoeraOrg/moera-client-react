import { call, put, select } from 'typed-redux-saga';

import { imageUpload, Node } from "api";
import {
    LinkPreviewImageUploadAction,
    linkPreviewImageUploaded,
    linkPreviewImageUploadFailed,
    LinkPreviewLoadAction,
    linkPreviewLoaded,
    linkPreviewLoadFailed
} from "state/linkpreviews/actions";
import { executor } from "state/executor";
import { getLinkPreviewInfo } from "state/linkpreviews/selectors";
import { randomId } from "util/misc";

export default [
    executor("LINK_PREVIEW_LOAD", payload => payload.url, linkPreviewLoadSaga),
    executor("LINK_PREVIEW_IMAGE_UPLOAD", payload => payload.url, linkPreviewImageUploadSaga)
];

function* linkPreviewLoadSaga(action: LinkPreviewLoadAction) {
    const {url} = action.payload;
    try {
        const info = yield* call(Node.proxyLinkPreview, action, ":", url);
        info.url = url; // canonical URL may differ, so we should force consistency throughout the app
        yield* put(linkPreviewLoaded(url, info).causedBy(action));
    } catch (e) {
        yield* put(linkPreviewLoadFailed(url).causedBy(action));
    }
}

function* linkPreviewImageUploadSaga(action: LinkPreviewImageUploadAction) {
    const {url, nodeName, features} = action.payload;

    const imageUrl = yield* select(state => getLinkPreviewInfo(state, url)?.imageUrl);
    if (imageUrl == null) {
        yield* put(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        return;
    }

    try {
        const blob = yield* call(Node.proxyMedia, action, ":", imageUrl);
        const file = new File([blob], `moera-lp-${randomId()}.img`, {type: blob.type});
        const mediaFile = yield* call(imageUpload, action, features, nodeName, file, true);
        if (mediaFile != null) {
            yield* put(linkPreviewImageUploaded(url, nodeName, mediaFile).causedBy(action));
        } else {
            yield* put(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
        }
    } catch (e) {
        yield* put(linkPreviewImageUploadFailed(url, nodeName).causedBy(action));
    }
}

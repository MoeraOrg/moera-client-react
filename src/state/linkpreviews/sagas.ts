import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { imageUpload } from "api/node/images-upload";
import {
    LINK_PREVIEW_IMAGE_UPLOAD,
    LINK_PREVIEW_LOAD,
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
    executor(LINK_PREVIEW_LOAD, payload => payload.url, linkPreviewLoadSaga),
    executor(LINK_PREVIEW_IMAGE_UPLOAD, payload => payload.url, linkPreviewImageUploadSaga)
];

function* linkPreviewLoadSaga(action: LinkPreviewLoadAction) {
    const {url} = action.payload;
    try {
        const info = yield* call(Node.proxyLinkPreview, ":", url);
        yield* put(linkPreviewLoaded(url, info));
    } catch (e) {
        yield* put(linkPreviewLoadFailed(url));
    }
}

function* linkPreviewImageUploadSaga(action: LinkPreviewImageUploadAction) {
    const {url, nodeName, features} = action.payload;

    const imageUrl = yield* select(state => getLinkPreviewInfo(state, url)?.imageUrl);
    if (imageUrl == null) {
        yield* put(linkPreviewImageUploadFailed(url, nodeName));
        return;
    }

    try {
        const blob = yield* call(Node.proxyMedia, ":", imageUrl);
        const file = new File([blob], `moera-lp-${randomId()}.img`, {type: blob.type});
        const mediaFile = yield* call(imageUpload, features, nodeName, file, true);
        if (mediaFile != null) {
            yield* put(linkPreviewImageUploaded(url, nodeName, mediaFile));
        } else {
            yield* put(linkPreviewImageUploadFailed(url, nodeName));
        }
    } catch (e) {
        yield* put(linkPreviewImageUploadFailed(url, nodeName));
    }
}

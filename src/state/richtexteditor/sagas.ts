import { call, put, spawn } from 'typed-redux-saga';

import { Node, PostingText } from "api";
import { imageUpload } from "api/node/images-upload";
import { WithContext } from "state/action-types";
import { RichTextEditorImageCopyAction, RichTextEditorImagesUploadAction } from "state/richtexteditor/actions";
import { postingSet } from "state/postings/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import { absoluteNodeName, REL_CURRENT, REL_HOME } from "util/rel-node-name";

export default [
    executor("RICH_TEXT_EDITOR_IMAGES_UPLOAD", null, richTextEditorImagesUploadSaga),
    executor("RICH_TEXT_EDITOR_IMAGE_COPY", null, richTextEditorImageCopySaga)
];

function* richTextEditorImageUpload(action: WithContext<RichTextEditorImagesUploadAction>, index: number) {
    const {
        features, nodeName, files, compress, onSuccess, onProgress, onFailure, captionSrc, captionSrcFormat
    } = action.payload;
    const {homeOwnerName, homeOwnerFullName} = action.context;

    if (homeOwnerName == null) {
        onFailure(index);
        return;
    }

    const mediaFile = yield* call(imageUpload, action, features, nodeName, homeOwnerName, files[index], compress,
        (loaded: number, total: number) => onProgress(index, loaded, total));
    if (mediaFile != null) {
        if (captionSrc != null && mediaFile.postingId != null) {
            const postingText: PostingText = {
                ownerName: homeOwnerName,
                ownerFullName: homeOwnerFullName,
                bodySrc: captionSrc,
                bodySrcFormat: captionSrcFormat || "markdown"
            };
            const posting = yield* call(Node.updatePosting, action, nodeName, mediaFile.postingId, postingText);
            yield* put(postingSet(posting, REL_CURRENT).causedBy(action));

            const remoteNodeName = absoluteNodeName(nodeName, action.context);
            if (remoteNodeName != null && remoteNodeName !== postingText.ownerName) {
                const sourceText = {
                    bodySrc: postingText.bodySrc,
                    bodySrcFormat: postingText.bodySrcFormat,
                    acceptedReactions: postingText.acceptedReactions
                }
                yield* call(Node.updateRemotePosting, action, REL_HOME, remoteNodeName, mediaFile.postingId, sourceText);
            }
        }
        onSuccess(index, mediaFile);
    } else {
        onFailure(index);
    }
}

function* richTextEditorImagesUploadSaga(action: WithContext<RichTextEditorImagesUploadAction>) {
    for (let i = 0; i < action.payload.files.length; i++) {
        yield* spawn(richTextEditorImageUpload, action, i);
    }
}

function* richTextEditorImageCopySaga(action: WithContext<RichTextEditorImageCopyAction>) {
    const {url, onSuccess, onFailure} = action.payload;
    try {
        const blob = yield* call(Node.proxyMedia, action, REL_HOME, url);
        onSuccess(new File([blob], "moera-editor.img", {type: blob.type}));
    } catch (e) {
        onFailure();
        yield* put(errorThrown(e));
    }
}

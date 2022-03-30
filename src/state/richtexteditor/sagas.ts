import { call, put, spawn } from 'typed-redux-saga';

import { Node } from "api";
import { imageUpload } from "api/node/images-upload";
import {
    RICH_TEXT_EDITOR_IMAGE_COPY,
    RICH_TEXT_EDITOR_IMAGES_UPLOAD,
    RichTextEditorImageCopyAction,
    RichTextEditorImagesUploadAction
} from "state/richtexteditor/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";

export default [
    executor(RICH_TEXT_EDITOR_IMAGES_UPLOAD, null, richTextEditorImagesUploadSaga),
    executor(RICH_TEXT_EDITOR_IMAGE_COPY, null, richTextEditorImageCopySaga)
];

function* richTextEditorImageUpload(action: RichTextEditorImagesUploadAction, index: number) {
    const {features, nodeName, files, compress, onSuccess, onProgress, onFailure} = action.payload;
    const mediaFile = yield* call(imageUpload, features, nodeName, files[index], compress,
        (loaded, total) => onProgress(index, loaded, total));
    if (mediaFile != null) {
        onSuccess(index, mediaFile);
    } else {
        onFailure(index);
    }
}

function* richTextEditorImagesUploadSaga(action: RichTextEditorImagesUploadAction) {
    for (let i = 0; i < action.payload.files.length; i++) {
        yield* spawn(richTextEditorImageUpload, action, i);
    }
}

function* richTextEditorImageCopySaga(action: RichTextEditorImageCopyAction) {
    const {url, onSuccess, onFailure} = action.payload;
    try {
        const blob = yield* call(Node.proxyMedia, ":", url);
        onSuccess(new File([blob], "moera-editor.img", {type: blob.type}));
    } catch (e) {
        onFailure();
        yield* put(errorThrown(e));
    }
}

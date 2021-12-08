import { call, put } from 'typed-redux-saga';
import imageCompression from 'browser-image-compression';
import * as Base64js from 'base64-js';

import { Node } from "api";
import { RICH_TEXT_EDITOR_IMAGES_UPLOAD, RichTextEditorImagesUploadAction } from "state/richtexteditor/actions";
import { messageBox } from "state/messagebox/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import { readAsArrayBuffer } from "util/read-file";

export default [
    executor(RICH_TEXT_EDITOR_IMAGES_UPLOAD, null, richTextEditorImagesUploadSaga)
];

const formatMb = (size: number): string =>
    (size / 1024 / 1024).toLocaleString("en-US", {maximumFractionDigits: 2}) + "Mb";

function* imageUpload(action: RichTextEditorImagesUploadAction, index: number) {
    const {features, nodeName, files, compress, onSuccess, onProgress, onFailure} = action.payload;
    try {
        let file = files[index];
        if (features != null) {
            if (compress) {
                file = yield* call(imageCompression, file, {
                    maxSizeMB: features.imageRecommendedSize / 1024 / 1024,
                    maxWidthOrHeight: features.imageRecommendedPixels
                });
            } else {
                if (file.size > features.mediaMaxSize) {
                    yield* put(messageBox(`File "${file.name}" cannot be uploaded because its size`
                        + ` (${formatMb(file.size)}) is larger than maximum allowed size`
                        + ` (${formatMb(features.mediaMaxSize)})`));
                    onFailure(index);
                    return;
                }
            }
        }

        let digest: string | null = null;
        if (window.crypto.subtle) {
            const fileContent = yield* call(readAsArrayBuffer, file);
            digest = Base64js.fromByteArray(new Uint8Array(
                yield* call([window.crypto.subtle, window.crypto.subtle.digest], "SHA-256", fileContent)));
        }

        const mediaFile = yield* call(Node.postMediaPrivate, nodeName, file,
            (loaded: number, total: number) => onProgress(index, loaded, total));
        onSuccess(index, {...mediaFile, digest});
    } catch (e) {
        onFailure(index);
        yield* put(errorThrown(e));
    }
}

function* richTextEditorImagesUploadSaga(action: RichTextEditorImagesUploadAction) {
    for (let i = 0; i < action.payload.files.length; i++) {
        yield* call(imageUpload, action, i);
    }
}

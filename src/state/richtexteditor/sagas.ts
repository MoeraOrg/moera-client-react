import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { RICH_TEXT_EDITOR_IMAGES_UPLOAD, RichTextEditorImagesUploadAction } from "state/richtexteditor/actions";
import { messageBox } from "state/messagebox/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";

export default [
    executor(RICH_TEXT_EDITOR_IMAGES_UPLOAD, null, richTextEditorImageUploadSaga)
];

const formatMb = (size: number): string =>
    (size / 1024 / 1024).toLocaleString("en-US", {maximumFractionDigits: 2}) + "Mb";

function* imageUpload(action: RichTextEditorImagesUploadAction, index: number) {
    const {features, files, onSuccess, onProgress, onFailure} = action.payload;
    try {
        if (features != null && files[index].size > features.mediaMaxSize) {
            yield* put(messageBox(`File "${files[index].name}" cannot be uploaded because its size`
                                  + ` (${formatMb(files[index].size)}) is larger than maximum allowed size`
                                  + ` (${formatMb(features.mediaMaxSize)})`));
            onFailure(index);
            return;
        }

        const mediaFile = yield* call(Node.postMediaPrivate, "", files[index],
            (loaded: number, total: number) => onProgress(index, loaded, total));
        onSuccess(index, mediaFile);
    } catch (e) {
        onFailure(index);
        yield* put(errorThrown(e));
    }
}

function* richTextEditorImageUploadSaga(action: RichTextEditorImagesUploadAction) {
    for (let i = 0; i < action.payload.files.length; i++) {
        yield* call(imageUpload, action, i);
    }
}

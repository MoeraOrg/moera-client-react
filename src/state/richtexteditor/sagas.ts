import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { RICH_TEXT_EDITOR_IMAGES_UPLOAD, RichTextEditorImagesUploadAction } from "state/richtexteditor/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";

export default [
    executor(RICH_TEXT_EDITOR_IMAGES_UPLOAD, null, richTextEditorImageUploadSaga)
];

function* imageUpload(action: RichTextEditorImagesUploadAction, index: number) {
    try {
        const mediaFile = yield* call(Node.postMediaPrivate, "", action.payload.files[index],
            (loaded: number, total: number) => action.payload.onProgress(index, loaded, total));
        action.payload.onSuccess(index, mediaFile);
    } catch (e) {
        action.payload.onFailure(index);
        yield* put(errorThrown(e));
    }
}

function* richTextEditorImageUploadSaga(action: RichTextEditorImagesUploadAction) {
    for (let i = 0; i < action.payload.files.length; i++) {
        yield* call(imageUpload, action, i);
    }
}

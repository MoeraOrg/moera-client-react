import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { RICH_TEXT_EDITOR_IMAGE_UPLOAD, RichTextEditorImageUploadAction } from "state/richtexteditor/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";

export default [
    executor(RICH_TEXT_EDITOR_IMAGE_UPLOAD, null, richTextEditorImageUploadSaga)
];

function* richTextEditorImageUploadSaga(action: RichTextEditorImageUploadAction) {
    try {
        const mediaFile = yield* call(Node.postMediaPrivate, "", action.payload.file,
            (loaded: number, total: number) => action.payload.onProgress(loaded, total));
        action.payload.onSuccess(mediaFile);
    } catch (e) {
        action.payload.onFailure();
        yield* put(errorThrown(e));
    }
}

import { Node } from "api";
import { mediaUpload } from "api/node/media-upload";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import {
    RichTextEditorImageCopyAction,
    RichTextEditorMediaRenameAction,
    RichTextEditorMediaUploadAction
} from "state/richtexteditor/actions";
import { errorThrown } from "state/error/actions";
import { saga } from "state/saga";
import { MediaFileWithCaption } from "ui/control/richtexteditor";
import { REL_HOME } from "util/rel-node-name";

export default [
    saga("RICH_TEXT_EDITOR_MEDIA_UPLOAD", null, richTextEditorMediaUploadSaga),
    saga("RICH_TEXT_EDITOR_IMAGE_COPY", null, richTextEditorImageCopySaga),
    saga("RICH_TEXT_EDITOR_MEDIA_RENAME", null, richTextEditorMediaRenameSaga),
];

async function richTextEditorMediaUpload(
    action: WithContext<RichTextEditorMediaUploadAction>, index: number
): Promise<void> {
    const {
        features, nodeName, files, compress, onSuccess, onProgress, onFailure, captionSrc, captionSrcFormat
    } = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        onFailure(index);
        return;
    }

    const mediaFile = await mediaUpload(
        action, features, nodeName, homeOwnerName, files[index], compress,
        (loaded: number, total: number) => onProgress(index, loaded, total)
    );
    if (mediaFile != null) {
        const mediaFileWithCaption: MediaFileWithCaption = {
            ...mediaFile,
            captionPostingId: null,
            caption: captionSrc
                ? {
                    mediaId: mediaFile.id,
                    captionSrc,
                    captionSrcFormat: captionSrcFormat ?? "markdown",
                }
                : undefined
        }
        onSuccess(index, mediaFileWithCaption);
    } else {
        onFailure(index);
    }
}

function richTextEditorMediaUploadSaga(action: WithContext<RichTextEditorMediaUploadAction>): void {
    for (let i = 0; i < action.payload.files.length; i++) {
        richTextEditorMediaUpload(action, i);
    }
}

async function richTextEditorImageCopySaga(action: WithContext<RichTextEditorImageCopyAction>): Promise<void> {
    const {url, onSuccess, onFailure} = action.payload;
    try {
        const blob = await Node.proxyMedia(action, REL_HOME, url);
        onSuccess(new File([blob], "moera-editor.img", {type: blob.type}));
    } catch (e) {
        onFailure();
        dispatch(errorThrown(e));
    }
}

async function richTextEditorMediaRenameSaga(action: WithContext<RichTextEditorMediaRenameAction>): Promise<void> {
    const {id, title, onSuccess, onFailure} = action.payload;
    try {
        const media = await Node.updatePrivateMediaInfo(action, REL_HOME, id, {title});
        onSuccess(media);
    } catch (e) {
        onFailure();
        dispatch(errorThrown(e));
    }
}

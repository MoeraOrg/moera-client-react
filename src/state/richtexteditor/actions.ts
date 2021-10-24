import { ActionWithPayload } from "state/action-types";
import { PrivateMediaFileInfo } from "api/node/api-types";
import { ProgressHandler } from "api/node/xhr";

export const RICH_TEXT_EDITOR_IMAGE_UPLOAD = "RICH_TEXT_EDITOR_IMAGE_UPLOAD";
export type RichTextEditorImageUploadAction = ActionWithPayload<typeof RICH_TEXT_EDITOR_IMAGE_UPLOAD, {
    file: File;
    onSuccess: (mediaFile: PrivateMediaFileInfo) => void;
    onFailure: () => void;
    onProgress: ProgressHandler;
}>;
export const richTextEditorImageUpload = (file: File,
                                          onSuccess: (mediaFile: PrivateMediaFileInfo) => void,
                                          onFailure: () => void,
                                          onProgress: ProgressHandler): RichTextEditorImageUploadAction => ({
    type: RICH_TEXT_EDITOR_IMAGE_UPLOAD,
    payload: {file, onSuccess, onFailure, onProgress}
});

export type RichTextEditorAnyAction =
    RichTextEditorImageUploadAction;

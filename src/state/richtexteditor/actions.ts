import { ActionWithPayload } from "state/action-types";
import { PostingFeatures, PrivateMediaFileInfo } from "api/node/api-types";

export const RICH_TEXT_EDITOR_IMAGES_UPLOAD = "RICH_TEXT_EDITOR_IMAGES_UPLOAD";
type ImageUploadSuccessHandler = (index: number, mediaFile: PrivateMediaFileInfo) => void;
type ImageUploadFailureHandler = (index: number) => void;
type ImageUploadProgressHandler = (index: number, loaded: number, total: number) => void;
export type RichTextEditorImagesUploadAction = ActionWithPayload<typeof RICH_TEXT_EDITOR_IMAGES_UPLOAD, {
    files: File[];
    features: PostingFeatures | null;
    onSuccess: ImageUploadSuccessHandler;
    onFailure: ImageUploadFailureHandler;
    onProgress: ImageUploadProgressHandler;
}>;
export const richTextEditorImagesUpload = (
    files: File[],
    features: PostingFeatures | null,
    onSuccess: ImageUploadSuccessHandler,
    onFailure: ImageUploadFailureHandler,
    onProgress: ImageUploadProgressHandler
): RichTextEditorImagesUploadAction => ({
    type: RICH_TEXT_EDITOR_IMAGES_UPLOAD,
    payload: {files, features, onSuccess, onFailure, onProgress}
});

export type RichTextEditorAnyAction =
    RichTextEditorImagesUploadAction;

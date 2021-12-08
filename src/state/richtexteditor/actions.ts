import { ActionWithPayload } from "state/action-types";
import { PostingFeatures, PrivateMediaFileInfo } from "api/node/api-types";

export interface RichTextMedia extends PrivateMediaFileInfo {
    digest?: string | null;
}

export const RICH_TEXT_EDITOR_IMAGES_UPLOAD = "RICH_TEXT_EDITOR_IMAGES_UPLOAD";
type ImageUploadSuccessHandler = (index: number, mediaFile: RichTextMedia) => void;
type ImageUploadFailureHandler = (index: number) => void;
type ImageUploadProgressHandler = (index: number, loaded: number, total: number) => void;
export type RichTextEditorImagesUploadAction = ActionWithPayload<typeof RICH_TEXT_EDITOR_IMAGES_UPLOAD, {
    nodeName: string | null;
    files: File[];
    features: PostingFeatures | null;
    compress: boolean;
    onSuccess: ImageUploadSuccessHandler;
    onFailure: ImageUploadFailureHandler;
    onProgress: ImageUploadProgressHandler;
}>;
export const richTextEditorImagesUpload = (
    nodeName: string | null,
    files: File[],
    features: PostingFeatures | null,
    compress: boolean,
    onSuccess: ImageUploadSuccessHandler,
    onFailure: ImageUploadFailureHandler,
    onProgress: ImageUploadProgressHandler
): RichTextEditorImagesUploadAction => ({
    type: RICH_TEXT_EDITOR_IMAGES_UPLOAD,
    payload: {nodeName, files, features, compress, onSuccess, onFailure, onProgress}
});

export type RichTextEditorAnyAction =
    RichTextEditorImagesUploadAction;

import { ActionWithPayload } from "state/action-types";
import { PostingFeatures, VerifiedMediaFile } from "api";

type ImagesUploadSuccessHandler = (index: number, mediaFile: VerifiedMediaFile) => void;
type ImagesUploadFailureHandler = (index: number) => void;
type ImagesUploadProgressHandler = (index: number, loaded: number, total: number) => void;

export const RICH_TEXT_EDITOR_IMAGES_UPLOAD = "RICH_TEXT_EDITOR_IMAGES_UPLOAD";
export type RichTextEditorImagesUploadAction = ActionWithPayload<typeof RICH_TEXT_EDITOR_IMAGES_UPLOAD, {
    nodeName: string | null;
    files: File[];
    features: PostingFeatures | null;
    compress: boolean;
    onSuccess: ImagesUploadSuccessHandler;
    onFailure: ImagesUploadFailureHandler;
    onProgress: ImagesUploadProgressHandler;
}>;
export const richTextEditorImagesUpload = (
    nodeName: string | null,
    files: File[],
    features: PostingFeatures | null,
    compress: boolean,
    onSuccess: ImagesUploadSuccessHandler,
    onFailure: ImagesUploadFailureHandler,
    onProgress: ImagesUploadProgressHandler
): RichTextEditorImagesUploadAction => ({
    type: RICH_TEXT_EDITOR_IMAGES_UPLOAD,
    payload: {nodeName, files, features, compress, onSuccess, onFailure, onProgress}
});

type ImageDownloadSuccessHandler = (file: File) => void;
type ImageDownloadFailureHandler = () => void;

export const RICH_TEXT_EDITOR_IMAGE_COPY = "RICH_TEXT_EDITOR_IMAGE_COPY";
export type RichTextEditorImageCopyAction = ActionWithPayload<typeof RICH_TEXT_EDITOR_IMAGE_COPY, {
    url: string;
    onSuccess: ImageDownloadSuccessHandler;
    onFailure: ImageDownloadFailureHandler;
}>;
export const richTextEditorImageCopy = (
    url: string,
    onSuccess: ImageDownloadSuccessHandler,
    onFailure: ImageDownloadFailureHandler
): RichTextEditorImageCopyAction => ({
    type: RICH_TEXT_EDITOR_IMAGE_COPY,
    payload: {url, onSuccess, onFailure}
});

export type RichTextEditorAnyAction =
    RichTextEditorImagesUploadAction
    | RichTextEditorImageCopyAction;

import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { PostingFeatures, RejectedReactions, SourceFormat, VerifiedMediaFile } from "api";
import { RelNodeName } from "util/rel-node-name";

type ImagesUploadSuccessHandler = (index: number, mediaFile: VerifiedMediaFile) => void;
type ImagesUploadFailureHandler = (index: number) => void;
type ImagesUploadProgressHandler = (index: number, loaded: number, total: number) => void;

export type RichTextEditorImagesUploadAction = ActionWithPayload<"RICH_TEXT_EDITOR_IMAGES_UPLOAD", {
    nodeName: RelNodeName | string;
    files: File[];
    features: PostingFeatures | null;
    compress: boolean;
    onSuccess: ImagesUploadSuccessHandler;
    onFailure: ImagesUploadFailureHandler;
    onProgress: ImagesUploadProgressHandler;
    captionSrc?: string | null;
    captionSrcFormat?: SourceFormat | null;
    rejectedReactions?: RejectedReactions | null;
}>;
export const richTextEditorImagesUpload = (
    nodeName: RelNodeName | string,
    files: File[],
    features: PostingFeatures | null,
    compress: boolean,
    onSuccess: ImagesUploadSuccessHandler,
    onFailure: ImagesUploadFailureHandler,
    onProgress: ImagesUploadProgressHandler,
    captionSrc?: string | null,
    captionSrcFormat?: SourceFormat | null,
    rejectedReactions?: RejectedReactions | null
): RichTextEditorImagesUploadAction =>
    actionWithPayload(
        "RICH_TEXT_EDITOR_IMAGES_UPLOAD",
        {
            nodeName, files, features, compress, onSuccess, onFailure, onProgress, captionSrc, captionSrcFormat,
            rejectedReactions
        }
    );

type ImageDownloadSuccessHandler = (file: File) => void;
type ImageDownloadFailureHandler = () => void;

export type RichTextEditorImageCopyAction = ActionWithPayload<"RICH_TEXT_EDITOR_IMAGE_COPY", {
    url: string;
    onSuccess: ImageDownloadSuccessHandler;
    onFailure: ImageDownloadFailureHandler;
}>;
export const richTextEditorImageCopy = (
    url: string,
    onSuccess: ImageDownloadSuccessHandler,
    onFailure: ImageDownloadFailureHandler
): RichTextEditorImageCopyAction =>
    actionWithPayload("RICH_TEXT_EDITOR_IMAGE_COPY", {url, onSuccess, onFailure});

export type RichTextEditorAnyAction =
    RichTextEditorImagesUploadAction
    | RichTextEditorImageCopyAction;

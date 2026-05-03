import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { Body, PostingFeatures, PrivateMediaFileInfo, SourceFormat } from "api";
import { MediaFileWithCaption } from "ui/control/richtexteditor";
import { RelNodeName } from "util/rel-node-name";

type MediaUploadSuccessHandler = (index: number, mediaFile: MediaFileWithCaption) => void;
type MediaUploadFailureHandler = (index: number) => void;
type MediaUploadProgressHandler = (index: number, loaded: number, total: number) => void;

export type RichTextEditorMediaUploadAction = ActionWithPayload<"RICH_TEXT_EDITOR_MEDIA_UPLOAD", {
    nodeName: RelNodeName | string;
    files: File[];
    features: PostingFeatures | null;
    compress: boolean;
    onSuccess: MediaUploadSuccessHandler;
    onFailure: MediaUploadFailureHandler;
    onProgress: MediaUploadProgressHandler;
    captionSrc?: Body | null;
    captionSrcFormat?: SourceFormat | null;
}>;
export const richTextEditorMediaUpload = (
    nodeName: RelNodeName | string,
    files: File[],
    features: PostingFeatures | null,
    compress: boolean,
    onSuccess: MediaUploadSuccessHandler,
    onFailure: MediaUploadFailureHandler,
    onProgress: MediaUploadProgressHandler,
    captionSrc?: Body | null,
    captionSrcFormat?: SourceFormat | null
): RichTextEditorMediaUploadAction =>
    actionWithPayload(
        "RICH_TEXT_EDITOR_MEDIA_UPLOAD",
        {nodeName, files, features, compress, onSuccess, onFailure, onProgress, captionSrc, captionSrcFormat}
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

type MediaRenameSuccessHandler = (media: PrivateMediaFileInfo) => void;
type MediaRenameFailureHandler = () => void;

export type RichTextEditorMediaRenameAction = ActionWithPayload<"RICH_TEXT_EDITOR_MEDIA_RENAME", {
    id: string;
    title: string;
    onSuccess: MediaRenameSuccessHandler;
    onFailure: MediaRenameFailureHandler;
}>;
export const richTextEditorMediaRename = (
    id: string,
    title: string,
    onSuccess: MediaRenameSuccessHandler,
    onFailure: MediaRenameFailureHandler
): RichTextEditorMediaRenameAction =>
    actionWithPayload("RICH_TEXT_EDITOR_MEDIA_RENAME", {id, title, onSuccess, onFailure});

export type RichTextEditorAnyAction =
    RichTextEditorMediaUploadAction
    | RichTextEditorImageCopyAction
    | RichTextEditorMediaRenameAction;

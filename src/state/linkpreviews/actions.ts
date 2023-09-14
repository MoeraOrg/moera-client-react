import { ActionWithPayload } from "state/action-types";
import { LinkPreviewInfo, PostingFeatures, VerifiedMediaFile } from "api";

export const LINK_PREVIEW_LOAD = "LINK_PREVIEW_LOAD";
export type LinkPreviewLoadAction = ActionWithPayload<typeof LINK_PREVIEW_LOAD, {
    url: string;
}>;
export const linkPreviewLoad = (url: string): LinkPreviewLoadAction => ({
    type: LINK_PREVIEW_LOAD,
    payload: {url}
});

export const LINK_PREVIEW_LOADED = "LINK_PREVIEW_LOADED";
export type LinkPreviewLoadedAction = ActionWithPayload<typeof LINK_PREVIEW_LOADED, {
    url: string;
    info: LinkPreviewInfo;
}>;
export const linkPreviewLoaded = (url: string, info: LinkPreviewInfo): LinkPreviewLoadedAction => ({
    type: LINK_PREVIEW_LOADED,
    payload: {url, info}
});

export const LINK_PREVIEW_LOAD_FAILED = "LINK_PREVIEW_LOAD_FAILED";
export type LinkPreviewLoadFailedAction = ActionWithPayload<typeof LINK_PREVIEW_LOAD_FAILED, {
    url: string;
}>;
export const linkPreviewLoadFailed = (url: string): LinkPreviewLoadFailedAction => ({
    type: LINK_PREVIEW_LOAD_FAILED,
    payload: {url}
});

export const LINK_PREVIEW_IMAGE_UPLOAD = "LINK_PREVIEW_IMAGE_UPLOAD";
export type LinkPreviewImageUploadAction = ActionWithPayload<typeof LINK_PREVIEW_IMAGE_UPLOAD, {
    url: string;
    nodeName: string;
    features: PostingFeatures | null;
}>;
export const linkPreviewImageUpload = (url: string, nodeName: string,
                                       features: PostingFeatures | null): LinkPreviewImageUploadAction => ({
    type: LINK_PREVIEW_IMAGE_UPLOAD,
    payload: {url, nodeName, features}
});

export const LINK_PREVIEW_IMAGE_UPLOADED = "LINK_PREVIEW_IMAGE_UPLOADED";
export type LinkPreviewImageUploadedAction = ActionWithPayload<typeof LINK_PREVIEW_IMAGE_UPLOADED, {
    url: string;
    nodeName: string;
    info: VerifiedMediaFile;
}>;
export const linkPreviewImageUploaded = (url: string, nodeName: string,
                                         info: VerifiedMediaFile): LinkPreviewImageUploadedAction => ({
    type: LINK_PREVIEW_IMAGE_UPLOADED,
    payload: {url, nodeName, info}
});

export const LINK_PREVIEW_IMAGE_UPLOAD_FAILED = "LINK_PREVIEW_IMAGE_UPLOAD_FAILED";
export type LinkPreviewImageUploadFailedAction = ActionWithPayload<typeof LINK_PREVIEW_IMAGE_UPLOAD_FAILED, {
    url: string;
    nodeName: string;
}>;
export const linkPreviewImageUploadFailed = (url: string, nodeName: string): LinkPreviewImageUploadFailedAction => ({
    type: LINK_PREVIEW_IMAGE_UPLOAD_FAILED,
    payload: {url, nodeName}
});

export type LinkPreviewsAnyAction =
    LinkPreviewLoadAction
    | LinkPreviewLoadedAction
    | LinkPreviewLoadFailedAction
    | LinkPreviewImageUploadAction
    | LinkPreviewImageUploadedAction
    | LinkPreviewImageUploadFailedAction;

import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { LinkPreviewInfo, PostingFeatures, VerifiedMediaFile } from "api";

export type LinkPreviewLoadAction = ActionWithPayload<"LINK_PREVIEW_LOAD", {
    url: string;
}>;
export const linkPreviewLoad = (url: string): LinkPreviewLoadAction =>
    actionWithPayload("LINK_PREVIEW_LOAD", {url});

export type LinkPreviewLoadedAction = ActionWithPayload<"LINK_PREVIEW_LOADED", {
    url: string;
    info: LinkPreviewInfo;
}>;
export const linkPreviewLoaded = (url: string, info: LinkPreviewInfo): LinkPreviewLoadedAction =>
    actionWithPayload("LINK_PREVIEW_LOADED", {url, info});

export type LinkPreviewLoadFailedAction = ActionWithPayload<"LINK_PREVIEW_LOAD_FAILED", {
    url: string;
}>;
export const linkPreviewLoadFailed = (url: string): LinkPreviewLoadFailedAction =>
    actionWithPayload("LINK_PREVIEW_LOAD_FAILED", {url});

export type LinkPreviewImageUploadAction = ActionWithPayload<"LINK_PREVIEW_IMAGE_UPLOAD", {
    url: string;
    nodeName: string;
    features: PostingFeatures | null;
}>;
export const linkPreviewImageUpload = (
    url: string, nodeName: string, features: PostingFeatures | null
): LinkPreviewImageUploadAction =>
    actionWithPayload("LINK_PREVIEW_IMAGE_UPLOAD", {url, nodeName, features});

export type LinkPreviewImageUploadedAction = ActionWithPayload<"LINK_PREVIEW_IMAGE_UPLOADED", {
    url: string;
    nodeName: string;
    info: VerifiedMediaFile;
}>;
export const linkPreviewImageUploaded = (
    url: string, nodeName: string, info: VerifiedMediaFile
): LinkPreviewImageUploadedAction =>
    actionWithPayload("LINK_PREVIEW_IMAGE_UPLOADED", {url, nodeName, info});

export type LinkPreviewImageUploadFailedAction = ActionWithPayload<"LINK_PREVIEW_IMAGE_UPLOAD_FAILED", {
    url: string;
    nodeName: string;
}>;
export const linkPreviewImageUploadFailed = (url: string, nodeName: string): LinkPreviewImageUploadFailedAction =>
    actionWithPayload("LINK_PREVIEW_IMAGE_UPLOAD_FAILED", {url, nodeName});

export type LinkPreviewsAnyAction =
    LinkPreviewLoadAction
    | LinkPreviewLoadedAction
    | LinkPreviewLoadFailedAction
    | LinkPreviewImageUploadAction
    | LinkPreviewImageUploadedAction
    | LinkPreviewImageUploadFailedAction;

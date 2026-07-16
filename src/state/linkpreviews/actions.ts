import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { LinkPreviewInfo } from "api";
import { MediaWithCaption } from "util/media-with-caption";

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

export type LinkPreviewImageLeaseAction = ActionWithPayload<"LINK_PREVIEW_IMAGE_LEASE", {
    url: string;
    nodeName: string;
}>;
export const linkPreviewImageLease = (url: string, nodeName: string): LinkPreviewImageLeaseAction =>
    actionWithPayload("LINK_PREVIEW_IMAGE_LEASE", {url, nodeName});

export type LinkPreviewImageLeasedAction = ActionWithPayload<"LINK_PREVIEW_IMAGE_LEASED", {
    url: string;
    nodeName: string;
    info: MediaWithCaption;
}>;
export const linkPreviewImageLeased = (
    url: string, nodeName: string, info: MediaWithCaption
): LinkPreviewImageLeasedAction =>
    actionWithPayload("LINK_PREVIEW_IMAGE_LEASED", {url, nodeName, info});

export type LinkPreviewImageLeaseFailedAction = ActionWithPayload<"LINK_PREVIEW_IMAGE_LEASE_FAILED", {
    url: string;
    nodeName: string;
}>;
export const linkPreviewImageLeaseFailed = (url: string, nodeName: string): LinkPreviewImageLeaseFailedAction =>
    actionWithPayload("LINK_PREVIEW_IMAGE_LEASE_FAILED", {url, nodeName});

export type LinkPreviewsAnyAction =
    LinkPreviewLoadAction
    | LinkPreviewLoadedAction
    | LinkPreviewLoadFailedAction
    | LinkPreviewImageLeaseAction
    | LinkPreviewImageLeasedAction
    | LinkPreviewImageLeaseFailedAction;

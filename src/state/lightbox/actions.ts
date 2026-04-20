import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";

export type OpenLightboxAction = ActionWithPayload<"OPEN_LIGHTBOX", {
    nodeName: RelNodeName | string;
    postingId: string;
    commentId: string | null;
    mediaId: string | null;
}>;
export const openLightbox = (
    nodeName: RelNodeName | string, postingId: string, commentId: string | null, mediaId: string | null
): OpenLightboxAction =>
    actionWithPayload("OPEN_LIGHTBOX", {nodeName, postingId, commentId, mediaId});

export type CloseLightboxAction = ActionWithoutPayload<"CLOSE_LIGHTBOX">;
export const closeLightbox = (): CloseLightboxAction =>
    actionWithoutPayload("CLOSE_LIGHTBOX");

export type LightboxMediaSequence = "normal" | "next-loop" | "prev-loop";

export type LightboxMediaSetAction = ActionWithPayload<"LIGHTBOX_MEDIA_SET", {
    mediaId: string;
    sequence: LightboxMediaSequence;
}>;
export const lightboxMediaSet = (mediaId: string, sequence: LightboxMediaSequence): LightboxMediaSetAction =>
    actionWithPayload("LIGHTBOX_MEDIA_SET", {mediaId, sequence});

export type LightboxMediaPostingLoadAction = ActionWithoutPayload<"LIGHTBOX_MEDIA_POSTING_LOAD">;
export const lightboxMediaPostingLoad = (): LightboxMediaPostingLoadAction =>
    actionWithoutPayload("LIGHTBOX_MEDIA_POSTING_LOAD");

export type LightboxCopyLinkAction = ActionWithPayload<"LIGHTBOX_COPY_LINK", {
    nodeName: RelNodeName | string;
    url: string;
}>;
export const lightboxCopyLink = (nodeName: RelNodeName | string, url: string): LightboxCopyLinkAction =>
    actionWithPayload("LIGHTBOX_COPY_LINK", {nodeName, url});

export type LightboxAnyAction =
    OpenLightboxAction
    | CloseLightboxAction
    | LightboxMediaSetAction
    | LightboxMediaPostingLoadAction
    | LightboxCopyLinkAction;

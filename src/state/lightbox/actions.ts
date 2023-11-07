import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type OpenLightBoxAction = ActionWithPayload<"OPEN_LIGHT_BOX", {
    nodeName: string;
    postingId: string;
    commentId: string | null;
    mediaId: string | null;
}>;
export const openLightBox = (
    nodeName: string, postingId: string, commentId: string | null, mediaId: string | null
): OpenLightBoxAction =>
    actionWithPayload("OPEN_LIGHT_BOX", {nodeName, postingId, commentId, mediaId});

export type CloseLightBoxAction = ActionWithoutPayload<"CLOSE_LIGHT_BOX">;
export const closeLightBox = (): CloseLightBoxAction =>
    actionWithoutPayload("CLOSE_LIGHT_BOX");

export type LightBoxMediaSequence = "normal" | "next-loop" | "prev-loop";

export type LightBoxMediaSetAction = ActionWithPayload<"LIGHT_BOX_MEDIA_SET", {
    mediaId: string;
    sequence: LightBoxMediaSequence;
}>;
export const lightBoxMediaSet = (mediaId: string, sequence: LightBoxMediaSequence): LightBoxMediaSetAction =>
    actionWithPayload("LIGHT_BOX_MEDIA_SET", {mediaId, sequence});

export type LightBoxMediaPostingLoadAction = ActionWithoutPayload<"LIGHT_BOX_MEDIA_POSTING_LOAD">;
export const lightBoxMediaPostingLoad = (): LightBoxMediaPostingLoadAction =>
    actionWithoutPayload("LIGHT_BOX_MEDIA_POSTING_LOAD");

export type LightBoxCopyLinkAction = ActionWithPayload<"LIGHT_BOX_COPY_LINK", {
    nodeName: string;
    url: string;
}>;
export const lightBoxCopyLink = (nodeName: string, url: string): LightBoxCopyLinkAction =>
    actionWithPayload("LIGHT_BOX_COPY_LINK", {nodeName, url});

export type LightBoxCopyMediaLinkAction = ActionWithPayload<"LIGHT_BOX_COPY_MEDIA_LINK", {
    url: string;
}>;
export const lightBoxCopyMediaLink = (url: string): LightBoxCopyMediaLinkAction =>
    actionWithPayload("LIGHT_BOX_COPY_MEDIA_LINK", {url});

export type LightBoxAnyAction =
    OpenLightBoxAction
    | CloseLightBoxAction
    | LightBoxMediaSetAction
    | LightBoxMediaPostingLoadAction
    | LightBoxCopyLinkAction
    | LightBoxCopyMediaLinkAction;

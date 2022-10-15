import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const OPEN_LIGHT_BOX = "OPEN_LIGHT_BOX";
export type OpenLightBoxAction = ActionWithPayload<typeof OPEN_LIGHT_BOX, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
    mediaId: string | null;
}>;
export const openLightBox = (nodeName: string, postingId: string, commentId: string | null,
                             mediaId: string | null): OpenLightBoxAction => ({
    type: OPEN_LIGHT_BOX,
    payload: {nodeName, postingId, commentId, mediaId}
});

export const CLOSE_LIGHT_BOX = "CLOSE_LIGHT_BOX";
export type CloseLightBoxAction = Action<typeof CLOSE_LIGHT_BOX>;
export const closeLightBox = (): CloseLightBoxAction => ({
    type: CLOSE_LIGHT_BOX
});

export const LIGHT_BOX_MEDIA_SET = "LIGHT_BOX_MEDIA_SET";
export type LightBoxMediaSetAction = ActionWithPayload<typeof LIGHT_BOX_MEDIA_SET, {
    mediaId: string;
}>;
export const lightBoxMediaSet = (mediaId: string): LightBoxMediaSetAction => ({
    type: LIGHT_BOX_MEDIA_SET,
    payload: {mediaId}
});

export const LIGHT_BOX_MEDIA_POSTING_LOAD = "LIGHT_BOX_MEDIA_POSTING_LOAD";
export type LightBoxMediaPostingLoadAction = Action<typeof LIGHT_BOX_MEDIA_POSTING_LOAD>;
export const lightBoxMediaPostingLoad = (): LightBoxMediaPostingLoadAction => ({
    type: LIGHT_BOX_MEDIA_POSTING_LOAD
});

export const LIGHT_BOX_COPY_LINK = "LIGHT_BOX_COPY_LINK";
export type LightBoxCopyLinkAction = ActionWithPayload<typeof LIGHT_BOX_COPY_LINK, {
    nodeName: string;
    url: string;
}>;
export const lightBoxCopyLink = (nodeName: string, url: string): LightBoxCopyLinkAction => ({
    type: LIGHT_BOX_COPY_LINK,
    payload: {nodeName, url}
});

export const LIGHT_BOX_COPY_MEDIA_LINK = "LIGHT_BOX_COPY_MEDIA_LINK";
export type LightBoxCopyMediaLinkAction = ActionWithPayload<typeof LIGHT_BOX_COPY_MEDIA_LINK, {
    url: string;
}>;
export const lightBoxCopyMediaLink = (url: string): LightBoxCopyMediaLinkAction => ({
    type: LIGHT_BOX_COPY_MEDIA_LINK,
    payload: {url}
});

export type LightBoxAnyAction =
    OpenLightBoxAction
    | CloseLightBoxAction
    | LightBoxMediaSetAction
    | LightBoxMediaPostingLoadAction
    | LightBoxCopyLinkAction
    | LightBoxCopyMediaLinkAction;

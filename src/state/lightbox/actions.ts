import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const OPEN_LIGHT_BOX = "OPEN_LIGHT_BOX";
export type OpenLightBoxAction = ActionWithPayload<typeof OPEN_LIGHT_BOX, {
    postingId: string;
    mediaId: string | null;
}>;
export const openLightBox = (postingId: string, mediaId: string | null): OpenLightBoxAction => ({
    type: OPEN_LIGHT_BOX,
    payload: {postingId, mediaId}
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

export type LightBoxAnyAction =
    OpenLightBoxAction
    | CloseLightBoxAction
    | LightBoxMediaSetAction;
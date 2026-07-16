import * as immutable from 'object-path-immutable';

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { LinkImageState, LinkPreviewsState, LinkPreviewState } from "state/linkpreviews/state";

const initialState: LinkPreviewsState = {
};

const emptyLinkPreview: LinkPreviewState = {
    loading: false,
    loaded: false,
    info: null,
    images: {}
}

const emptyLinkImage: LinkImageState = {
    loading: false,
    info: null
}

export default (state: LinkPreviewsState = initialState, action: WithContext<ClientAction>): LinkPreviewsState => {
    switch (action.type) {
        case "LINK_PREVIEW_LOAD":
            return immutable.set(state, [action.payload.url], {
                ...emptyLinkPreview,
                loading: true
            });

        case "LINK_PREVIEW_LOADED":
            return immutable.assign(state, [action.payload.url], {
                loading: false,
                loaded: true,
                info: action.payload.info
            });

        case "LINK_PREVIEW_LOAD_FAILED":
            return immutable.assign(state, [action.payload.url], {
                loading: false,
                loaded: true,
                info: null
            });

        case "LINK_PREVIEW_IMAGE_LEASE":
            return immutable.set(state, [action.payload.url, "images", action.payload.nodeName], {
                ...emptyLinkImage,
                loading: true
            });

        case "LINK_PREVIEW_IMAGE_LEASED":
            return immutable.assign(state, [action.payload.url, "images", action.payload.nodeName], {
                loading: false,
                info: action.payload.info
            });

        case "LINK_PREVIEW_IMAGE_LEASE_FAILED":
            return immutable.set(state, [action.payload.url, "images", action.payload.nodeName, "loading"], false);

        default:
            return state;
    }
}

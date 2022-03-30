import * as immutable from 'object-path-immutable';

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { LinkImageState, LinkPreviewsState, LinkPreviewState } from "state/linkpreviews/state";
import {
    LINK_PREVIEW_IMAGE_UPLOAD,
    LINK_PREVIEW_IMAGE_UPLOAD_FAILED,
    LINK_PREVIEW_IMAGE_UPLOADED,
    LINK_PREVIEW_LOAD,
    LINK_PREVIEW_LOAD_FAILED,
    LINK_PREVIEW_LOADED
} from "state/linkpreviews/actions";

const initialState = {
};

const emptyLinkPreview: LinkPreviewState = {
    loading: false,
    loaded: false,
    info: null,
    images: {}
}

const emptyLinkImage: LinkImageState = {
    uploading: false,
    info: null
}

export default (state: LinkPreviewsState = initialState, action: WithContext<ClientAction>): LinkPreviewsState => {
    switch (action.type) {
        case LINK_PREVIEW_LOAD:
            return immutable.set(state, [action.payload.url], {
                ...emptyLinkPreview,
                loading: true
            });

        case LINK_PREVIEW_LOADED:
            return immutable.assign(state, [action.payload.url], {
                loading: false,
                loaded: true,
                info: action.payload.info
            });

        case LINK_PREVIEW_LOAD_FAILED:
            return immutable.assign(state, [action.payload.url], {
                loading: false,
                loaded: true,
                info: null
            });

        case LINK_PREVIEW_IMAGE_UPLOAD:
            return immutable.set(state, [action.payload.url, "images", action.payload.nodeName], {
                ...emptyLinkImage,
                uploading: true
            });

        case LINK_PREVIEW_IMAGE_UPLOADED:
            return immutable.assign(state, [action.payload.url, "images", action.payload.nodeName], {
                uploading: false,
                info: action.payload.info
            });

        case LINK_PREVIEW_IMAGE_UPLOAD_FAILED:
            return immutable.set(state, [action.payload.url, "images", action.payload.nodeName, "uploading"], false);

        default:
            return state;
    }
}

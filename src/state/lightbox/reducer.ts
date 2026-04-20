import { ClientAction } from "state/action";
import { LightboxState } from "state/lightbox/state";
import { REL_CURRENT } from "util/rel-node-name";

const initialState: LightboxState = {
    show: false,
    nodeName: REL_CURRENT,
    postingId: null,
    commentId: null,
    mediaId: null
}

export default (state: LightboxState = initialState, action: ClientAction): LightboxState => {
    switch (action.type) {
        case "OPEN_LIGHTBOX":
            return {
                ...state,
                show: true,
                nodeName: action.payload.nodeName,
                postingId: action.payload.postingId,
                commentId: action.payload.commentId,
                mediaId: action.payload.mediaId
            }

        case "CLOSE_LIGHTBOX":
            return {
                ...state,
                show: false
            }

        case "LIGHTBOX_MEDIA_SET":
            return {
                ...state,
                mediaId: action.payload.mediaId
            }

        default:
            return state;
    }
}

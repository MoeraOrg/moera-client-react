import { ClientAction } from "state/action";
import { LightBoxState } from "state/lightbox/state";
import { REL_CURRENT } from "util/rel-node-name";

const initialState: LightBoxState = {
    show: false,
    nodeName: REL_CURRENT,
    postingId: null,
    commentId: null,
    mediaId: null
}

export default (state: LightBoxState = initialState, action: ClientAction): LightBoxState => {
    switch (action.type) {
        case "OPEN_LIGHT_BOX":
            return {
                ...state,
                show: true,
                nodeName: action.payload.nodeName,
                postingId: action.payload.postingId,
                commentId: action.payload.commentId,
                mediaId: action.payload.mediaId
            }

        case "CLOSE_LIGHT_BOX":
            return {
                ...state,
                show: false
            }

        case "LIGHT_BOX_MEDIA_SET":
            return {
                ...state,
                mediaId: action.payload.mediaId
            }

        default:
            return state;
    }
}

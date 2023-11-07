import { ClientAction } from "state/action";
import { LightBoxState } from "state/lightbox/state";

const initialState = {
    show: false,
    nodeName: "",
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

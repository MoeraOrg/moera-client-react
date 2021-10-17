import { ClientAction } from "state/action";
import { LightBoxState } from "state/lightbox/state";
import { CLOSE_LIGHT_BOX, LIGHT_BOX_MEDIA_SET, OPEN_LIGHT_BOX } from "state/lightbox/actions";

const initialState = {
    show: false,
    loading: false,
    postingId: null,
    mediaId: null
}

export default (state: LightBoxState = initialState, action: ClientAction): LightBoxState => {
    switch (action.type) {
        case OPEN_LIGHT_BOX:
            return {
                ...state,
                show: true,
                postingId: action.payload.postingId,
                mediaId: action.payload.mediaId
            }

        case CLOSE_LIGHT_BOX:
            return {
                ...state,
                show: false
            }

        case LIGHT_BOX_MEDIA_SET:
            return {
                ...state,
                mediaId: action.payload.mediaId
            }

        default:
            return state;
    }
}

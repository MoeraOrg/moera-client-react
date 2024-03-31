import { ImageEditDialogState } from "state/imageeditdialog/state";
import { ClientAction } from "state/action";
import { REL_CURRENT } from "util/rel-node-name";

const initialState: ImageEditDialogState = {
    show: false,
    parentOverlayId: undefined,
    nodeName: REL_CURRENT,
    media: null,
    loading: false,
    saving: false
};

export default (state: ImageEditDialogState = initialState, action: ClientAction): ImageEditDialogState => {
    switch (action.type) {
        case "OPEN_IMAGE_EDIT_DIALOG":
            return {
                ...state,
                show: true,
                parentOverlayId: action.payload.parentOverlayId,
                nodeName: action.payload.nodeName,
                media: action.payload.media
            }

        case "CLOSE_IMAGE_EDIT_DIALOG":
            return {
                ...state,
                show: false
            }

        case "IMAGE_EDIT_DIALOG_LOAD":
            return {
                ...state,
                loading: true
            }

        case "IMAGE_EDIT_DIALOG_LOADED":
        case "IMAGE_EDIT_DIALOG_LOAD_FAILED":
            return {
                ...state,
                loading: false
            }

        case "IMAGE_EDIT_DIALOG_POST":
            return {
                ...state,
                saving: true
            }

        case "IMAGE_EDIT_DIALOG_POST_SUCCEEDED":
            return {
                ...state,
                saving: false,
                show: false
            }

        case "IMAGE_EDIT_DIALOG_POST_FAILED":
            return {
                ...state,
                saving: false
            }

        default:
            return state;
    }
}

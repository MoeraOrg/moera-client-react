import { ImageEditDialogState } from "state/imageeditdialog/state";
import {
    CLOSE_IMAGE_EDIT_DIALOG,
    IMAGE_EDIT_DIALOG_LOAD,
    IMAGE_EDIT_DIALOG_LOAD_FAILED,
    IMAGE_EDIT_DIALOG_LOADED,
    IMAGE_EDIT_DIALOG_POST,
    IMAGE_EDIT_DIALOG_POST_FAILED,
    IMAGE_EDIT_DIALOG_POST_SUCCEEDED,
    OPEN_IMAGE_EDIT_DIALOG
} from "state/imageeditdialog/actions";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    nodeName: null,
    media: null,
    loading: false,
    saving: false
};

export default (state: ImageEditDialogState = initialState, action: ClientAction): ImageEditDialogState => {
    switch (action.type) {
        case OPEN_IMAGE_EDIT_DIALOG:
            return {
                ...state,
                show: true,
                nodeName: action.payload.nodeName,
                media: action.payload.media
            }

        case CLOSE_IMAGE_EDIT_DIALOG:
            return {
                ...state,
                show: false
            }

        case IMAGE_EDIT_DIALOG_LOAD:
            return {
                ...state,
                loading: true
            }

        case IMAGE_EDIT_DIALOG_LOADED:
        case IMAGE_EDIT_DIALOG_LOAD_FAILED:
            return {
                ...state,
                loading: false
            }

        case IMAGE_EDIT_DIALOG_POST:
            return {
                ...state,
                saving: true
            }

        case IMAGE_EDIT_DIALOG_POST_SUCCEEDED:
            return {
                ...state,
                saving: false,
                show: false
            }

        case IMAGE_EDIT_DIALOG_POST_FAILED:
            return {
                ...state,
                saving: false
            }

        default:
            return state;
    }
}

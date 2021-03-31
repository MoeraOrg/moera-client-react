import {
    CLOSE_SOURCE_DIALOG,
    OPEN_SOURCE_DIALOG,
    SOURCE_DIALOG_LOAD_FAILED,
    SOURCE_DIALOG_LOADED
} from "state/sourcedialog/actions";

const initialState = {
    show: false,
    text: "",
    loading: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_SOURCE_DIALOG:
            return {
                ...state,
                show: true,
                loading: true
            }

        case CLOSE_SOURCE_DIALOG:
            return {
                ...state,
                show: false
            }

        case SOURCE_DIALOG_LOADED:
            return {
                ...state,
                loading: false,
                text: action.payload.text
            }

        case SOURCE_DIALOG_LOAD_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return state;
    }
}

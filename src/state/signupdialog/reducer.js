import {
    CANCEL_SIGN_UP_DIALOG,
    OPEN_SIGN_UP_DIALOG,
    SIGN_UP,
    SIGN_UP_FAILED,
    SIGNED_UP
} from "state/signupdialog/actions";

const initialState = {
    show: false,
    processing: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_SIGN_UP_DIALOG:
            return {
                ...state,
                show: true,
                processing: false
            };

        case SIGNED_UP:
        case CANCEL_SIGN_UP_DIALOG:
            return {
                ...state,
                show: false
            };

        case SIGN_UP:
            return {
                ...state,
                processing: true
            };

        case SIGN_UP_FAILED:
            return {
                ...state,
                processing: false
            };

        default:
            return state;
    }
}

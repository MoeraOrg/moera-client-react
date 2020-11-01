import { CANCEL_SIGN_UP_DIALOG, OPEN_SIGN_UP_DIALOG } from "state/signupdialog/actions";

const initialState = {
    show: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_SIGN_UP_DIALOG:
            return {
                ...state,
                show: true
            };

        case CANCEL_SIGN_UP_DIALOG:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

import { CONFIRM_BOX, CLOSE_CONFIRM_BOX } from "state/confirmbox/actions";

const initialState = {
    show: false,
    message: null,
    yes: "Yes",
    no: "No",
    onYes: null,
    onNo: null,
    variant: "primary"
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CONFIRM_BOX:
            return {
                ...state,
                show: true,
                ...action.payload
            };

        case CLOSE_CONFIRM_BOX:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

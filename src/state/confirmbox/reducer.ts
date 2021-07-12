import { CONFIRM_BOX, CLOSE_CONFIRM_BOX } from "state/confirmbox/actions";
import { ConfirmBoxState } from "state/confirmbox/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    message: null,
    yes: "Yes",
    no: "No",
    onYes: null,
    onNo: null,
    variant: "primary"
};

export default (state: ConfirmBoxState = initialState, action: ClientAction) => {
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

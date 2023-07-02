import { CONFIRM_BOX, CLOSE_CONFIRM_BOX } from "state/confirmbox/actions";
import { ConfirmBoxState } from "state/confirmbox/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    message: null,
    yes: null,
    no: null,
    cancel: null,
    onYes: null,
    onNo: null,
    onCancel: null,
    variant: "primary"
};

export default (state: ConfirmBoxState = initialState, action: ClientAction): ConfirmBoxState => {
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

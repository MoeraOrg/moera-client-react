import { ConfirmBoxState } from "state/confirmbox/state";
import { ClientAction } from "state/action";

const initialState: ConfirmBoxState = {
    show: false,
    message: null,
    yes: null,
    no: null,
    cancel: null,
    onYes: null,
    onNo: null,
    onCancel: null,
    variant: "primary",
    dontShowAgain: null,
    dontShowAgainBox: false,
    parentOverlayId: undefined
};

export default (state: ConfirmBoxState = initialState, action: ClientAction): ConfirmBoxState => {
    switch (action.type) {
        case "CONFIRM_BOX":
            return {
                ...initialState,
                show: true,
                ...action.payload.attributes
            };

        case "CLOSE_CONFIRM_BOX":
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

import { FlashBoxState } from "state/flashbox/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    dismissing: false,
    message: null
};

export default (state: FlashBoxState = initialState, action: ClientAction): FlashBoxState => {
    switch (action.type) {
        case "FLASH_BOX":
            return {
                ...state,
                show: true,
                dismissing: false,
                message: action.payload.message
            };

        case "FLASH_BOX_DISMISS":
            return {
                ...state,
                dismissing: true
            };

        case "FLASH_BOX_CLOSE":
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

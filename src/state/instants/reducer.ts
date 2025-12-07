import { InstantsState } from "state/instants/state";
import { ClientAction } from "state/action";

const initialState: InstantsState = {
    showPopover: false,
    border: Number.MAX_SAFE_INTEGER
};

export default (state: InstantsState = initialState, action: ClientAction): InstantsState => {
    switch (action.type) {
        case "OPEN_INSTANTS_POPOVER":
            return {
                ...state,
                showPopover: true
            };

        case "CLOSE_INSTANTS_POPOVER":
            return {
                ...state,
                showPopover: false
            };

        case "INSTANTS_BORDER_SET":
            return {
                ...state,
                border: action.payload.border
            };

        default:
            return state;
    }
}

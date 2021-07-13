import { MESSAGE_BOX, CLOSE_MESSAGE_BOX } from "state/messagebox/actions";
import { MessageBoxState } from "state/messagebox/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    message: null,
    onClose: null
};

export default (state: MessageBoxState = initialState, action: ClientAction): MessageBoxState => {
    switch (action.type) {
        case MESSAGE_BOX:
            return {
                ...state,
                show: true,
                ...action.payload
            };

        case CLOSE_MESSAGE_BOX:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

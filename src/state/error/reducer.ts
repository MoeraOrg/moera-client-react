import { ErrorState } from "state/error/state";
import { ClientAction } from "state/action";

const initialState = {
    message: "",
    messageVerbose: "",
    visible: false
};

export default (state: ErrorState = initialState, action: ClientAction): ErrorState => {
    switch (action.type) {
        case "ERROR_SHOW":
            const {message, messageVerbose} = action.payload;
            return {
                message: message,
                messageVerbose: messageVerbose ?? message,
                visible: true
            };
        case "ERROR_DISMISS":
            return {
                ...state,
                visible: false
            };
        default:
            return state;
    }
}

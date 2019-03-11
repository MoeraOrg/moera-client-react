import { ERROR_DISMISS, ERROR_SHOW } from "state/error/actions";

const initialState = {
    message: "",
    messageVerbose: "",
    visible: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ERROR_SHOW:
            const {message, messageVerbose} = action.payload;
            return {
                message: message,
                messageVerbose: messageVerbose ? messageVerbose : message,
                visible: true
            };
        case ERROR_DISMISS:
            return {
                ...state,
                visible: false
            };
        default:
            return state;
    }
}

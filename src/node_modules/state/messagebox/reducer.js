import { MESSAGE_BOX, CLOSE_MESSAGE_BOX } from "state/messagebox/actions";

const initialState = {
    show: false,
    message: null,
    onClose: null
};

export default (state = initialState, action) => {
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

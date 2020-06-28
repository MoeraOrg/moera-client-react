import { FLASH_BOX, FLASH_BOX_CLOSE, FLASH_BOX_DISMISS } from "state/flashbox/actions";

const initialState = {
    show: false,
    dismissing: false,
    message: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FLASH_BOX:
            return {
                ...state,
                show: true,
                dismissing: false,
                message: action.payload.message
            };

        case FLASH_BOX_DISMISS:
            return {
                ...state,
                dismissing: true
            };

        case FLASH_BOX_CLOSE:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

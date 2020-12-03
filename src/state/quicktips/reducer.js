import { CLOSE_QUICK_TIPS, OPEN_QUICK_TIPS } from "state/quicktips/actions";

const initialState = {
    show: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_QUICK_TIPS:
            return {
                ...state,
                show: true
            };

        case CLOSE_QUICK_TIPS:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}

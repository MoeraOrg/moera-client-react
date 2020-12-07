import { REFRESH_HIDE, REFRESH_SHOW } from "state/refresh/actions";

const initialState = {
    active: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REFRESH_SHOW:
            return {
                ...state,
                active: true
            }

        case REFRESH_HIDE:
            return {
                ...state,
                active: false
            }

        default:
            return state;
    }
}

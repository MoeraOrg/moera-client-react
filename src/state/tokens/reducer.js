import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

const initialState = {
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CONNECTED_TO_HOME:
            return {
                ...initialState,
                [action.payload.location]: {
                    token: action.payload.token,
                    permissions: action.payload.permissions
                }
            };

        case DISCONNECTED_FROM_HOME:
            return {
                ...initialState
            };

        default:
            return state;
    }
}

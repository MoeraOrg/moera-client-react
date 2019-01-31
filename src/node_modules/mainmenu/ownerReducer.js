import { OWNER_NAME_SET, OWNER_NAME_VERIFIED } from "mainmenu/ownerActions";

const initialState = {
    name: null,
    generation: 0,
    latest: false,
    verified: false,
    correct: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OWNER_NAME_SET:
            return {
                ...state,
                ...action.payload,
                verified: false
            };
        case OWNER_NAME_VERIFIED:
            if (state.name === action.payload.name) {
                return {
                    ...state,
                    ...action.payload,
                    verified: true
                };
            }
            return state;
        default:
            return state;
    }
}

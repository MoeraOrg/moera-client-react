import { OWNER_NAME_SET } from "mainmenu/ownerActions";

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
            return action.payload;
        default:
            return state;
    }
}

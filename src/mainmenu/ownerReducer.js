import { OWNER_NAME_LOAD } from "./ownerActions";

const initialState = {
    name: null,
    generation: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OWNER_NAME_LOAD:
            return {
                name: "unknown",
                generation: 1
            }
        default:
            return state;
    }
}

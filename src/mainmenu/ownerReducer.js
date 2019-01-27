import { OWNER_NAME_SET } from "./ownerActions";

const initialState = {
    name: null,
    generation: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OWNER_NAME_SET:
            return action.payload;
        default:
            return state;
    }
}

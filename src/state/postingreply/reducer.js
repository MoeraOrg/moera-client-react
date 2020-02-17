import { POSTING_REPLY, POSTING_REPLY_FAILED } from "state/postingreply/actions";

const initialState = {
    postingId: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case POSTING_REPLY:
            return {
                ...state,
                postingId: action.payload.id
            };

        case POSTING_REPLY_FAILED:
            return {
                ...state,
                postingId: null
            };

        default:
            return state;
    }
}

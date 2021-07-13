import { POSTING_REPLY, POSTING_REPLY_FAILED } from "state/postingreply/actions";
import { GO_TO_LOCATION, INIT_FROM_LOCATION } from "state/navigation/actions";
import { PostingReplyState } from "state/postingreply/state";
import { ClientAction } from "state/action";

const initialState = {
    postingId: null
};

export default (state: PostingReplyState = initialState, action: ClientAction): PostingReplyState => {
    switch (action.type) {
        case POSTING_REPLY:
            return {
                ...state,
                postingId: action.payload.id
            };

        case INIT_FROM_LOCATION:
        case GO_TO_LOCATION:
        case POSTING_REPLY_FAILED:
            return {
                ...state,
                postingId: null
            };

        default:
            return state;
    }
}

import { WEB_PUSH_SUBSCRIPTION_SET } from "state/webpush/actions";

const initialState = {
    subscriptionId: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case WEB_PUSH_SUBSCRIPTION_SET:
            return {
                ...state,
                subscriptionId: action.payload.id
            };

        default:
            return state;
    }
}

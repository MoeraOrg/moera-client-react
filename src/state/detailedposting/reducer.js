import { GO_TO_PAGE } from "state/navigation/actions";
import { PAGE_DETAILED_POSTING } from "state/navigation/pages";
import {
    DETAILED_POSTING_LOAD,
    DETAILED_POSTING_LOAD_FAILED,
    DETAILED_POSTING_LOADED
} from "state/detailedposting/actions";

const initialState = {
    id: null,
    loading: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GO_TO_PAGE:
            if (action.payload.page === PAGE_DETAILED_POSTING) {
                return {
                    ...state,
                    id: action.payload.details.id,
                    loading: false
                }
            }
            return state;

        case DETAILED_POSTING_LOAD:
            return {
                ...state,
                loading: true
            };

        case DETAILED_POSTING_LOADED:
        case DETAILED_POSTING_LOAD_FAILED:
            return {
                ...state,
                loading: false
            };

        default:
            return state;
    }
}

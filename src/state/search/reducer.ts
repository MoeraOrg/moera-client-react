import { ClientAction } from "state/action";
import { SearchState } from "state/search/state";

const initialState: SearchState = {
    query: "",
    loading: false,
    loaded: false,
    entries: []
}

export default (state: SearchState = initialState, action: ClientAction): SearchState => {
    switch (action.type) {
        case "SEARCH_LOAD":
            return {
                ...state,
                query: action.payload.query,
                loading: true,
                loaded: false,
                entries: []
            };

        case "SEARCH_LOADED":
            return {
                ...state,
                loading: false,
                loaded: true,
                entries: action.payload.entries
            };

        case "SEARCH_LOAD_FAILED":
            return {
                ...state,
                loading: false
            };

        default:
            return state;
    }
}

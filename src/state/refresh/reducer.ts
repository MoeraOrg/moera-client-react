import { RefreshState } from "state/refresh/state";
import { ClientAction } from "state/action";

const initialState: RefreshState = {
    active: false
};

export default (state: RefreshState = initialState, action: ClientAction): RefreshState => {
    switch (action.type) {
        case "REFRESH_SHOW":
            return {
                ...state,
                active: true
            }

        case "REFRESH_HIDE":
            return {
                ...state,
                active: false
            }

        default:
            return state;
    }
}

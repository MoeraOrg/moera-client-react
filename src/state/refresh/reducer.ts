import { RefreshState } from "state/refresh/state";
import { ClientAction } from "state/action";

const initialState: RefreshState = {
    active: false,
    confirmingReload: false
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

        case "REFRESH_CONFIRMING_RELOAD":
            return {
                ...state,
                confirmingReload: true
            }

        case "REFRESH_RELOAD_CANCELLED":
            return {
                ...state,
                confirmingReload: false
            }

        default:
            return state;
    }
}

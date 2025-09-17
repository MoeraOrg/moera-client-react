import { ExploreState } from "state/explore/state";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";

const initialState: ExploreState = {
    loadingActivePeople: false,
    loadedActivePeople: false,
    activePeople: [],
}

export default (state: ExploreState = initialState, action: WithContext<ClientAction>): ExploreState => {
    switch (action.type) {
        case "ACTIVE_PEOPLE_LOAD":
            return {
                ...state,
                loadingActivePeople: true
            }

        case "ACTIVE_PEOPLE_LOADED":
            return {
                ...state,
                loadingActivePeople: false,
                loadedActivePeople: true,
                activePeople: action.payload.list
            }

        case "ACTIVE_PEOPLE_LOAD_FAILED":
            return {
                ...state,
                loadingActivePeople: false
            }

        default:
            return state;
    }
}

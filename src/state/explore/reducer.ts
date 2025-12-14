import { ExploreState } from "state/explore/state";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";

const initialState: ExploreState = {
    loadingActivePeople: false,
    loadedActivePeople: false,
    activePeople: [],
    loadingTrending: false,
    loadedTrending: false,
    trending: [],
    loadingDiscussions: false,
    loadedDiscussions: false,
    discussions: []
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

        case "TRENDING_LOAD":
            return {
                ...state,
                loadingTrending: true
            }

        case "TRENDING_LOADED":
            return {
                ...state,
                loadingTrending: false,
                loadedTrending: true,
                trending: action.payload.list
            }

        case "TRENDING_LOAD_FAILED":
            return {
                ...state,
                loadingTrending: false
            }

        case "DISCUSSIONS_LOAD":
            return {
                ...state,
                loadingDiscussions: true
            }

        case "DISCUSSIONS_LOADED":
            return {
                ...state,
                loadingDiscussions: false,
                loadedDiscussions: true,
                discussions: action.payload.list
            }

        case "DISCUSSIONS_LOAD_FAILED":
            return {
                ...state,
                loadingDiscussions: false
            }

        default:
            return state;
    }
}

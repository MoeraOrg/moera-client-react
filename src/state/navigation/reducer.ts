import { NavigationState } from "state/navigation/state";
import { ClientAction } from "state/action";

const initialState: NavigationState = {
    page: "timeline",
    location: "",
    title: "",
    canonicalUrl: null,
    noIndex: false,
    bottomMenuVisible: true
};

export default (state: NavigationState = initialState, action: ClientAction): NavigationState => {
    switch (action.type) {
        case "GO_TO_PAGE":
            return {
                ...state,
                page: action.payload.page,
                bottomMenuVisible: true
            };

        case "LOCATION_SET":
            return {
                ...state,
                location: action.payload.location,
                title: action.payload.title ?? "",
                canonicalUrl: action.payload.canonicalUrl,
                noIndex: action.payload.noIndex
            };

        case "BOTTOM_MENU_HIDE":
            return {
                ...state,
                bottomMenuVisible: false
            }

        case "BOTTOM_MENU_SHOW":
            return {
                ...state,
                bottomMenuVisible: true
            }

        default:
            return state;
    }
}

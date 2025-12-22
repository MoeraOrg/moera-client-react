import { NavigationState } from "state/navigation/state";
import { ClientAction } from "state/action";

const initialState: NavigationState = {
    page: "timeline",
    location: "",
    title: "",
    canonicalUrl: null,
    noIndex: false,
    create: false,
    locked: false,
    bottomMenuVisible: true
};

export default (state: NavigationState = initialState, action: ClientAction): NavigationState => {
    switch (action.type) {
        case "INIT_FROM_LOCATION": { // FIXME
            let {path, query, hash} = action.payload;
            path = path != null && path.startsWith("/moera") ? path.substring(6) : path;
            return {
                ...state,
                location: path + (query ?? "") + (hash ?? "")
            };
        }

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
                noIndex: action.payload.noIndex,
                create: !state.locked ? action.payload.create : state.create && action.payload.create
            };

        case "LOCATION_LOCK":
            return {
                ...state,
                locked: true,
                create: true
            };

        case "LOCATION_UNLOCK":
            return {
                ...state,
                locked: false
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

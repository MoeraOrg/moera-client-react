import { NavigationState } from "state/navigation/state";
import { ClientAction } from "state/action";

const initialState: NavigationState = {
    page: "timeline",
    location: "",
    title: "",
    update: false,
    locked: false,
    bottomMenuVisible: true,
    closeDialogAction: null
};

export default (state: NavigationState = initialState, action: ClientAction): NavigationState => {
    switch (action.type) {
        case "INIT_FROM_LOCATION": {
            let {path, query, hash} = action.payload;
            path = path != null && path.startsWith("/moera") ? path.substring(6) : path;
            return {
                ...state,
                location: path + (query ?? "") + (hash ?? ""),
                closeDialogAction: null
            };
        }

        case "GO_TO_PAGE":
            return {
                ...state,
                page: action.payload.page,
                bottomMenuVisible: true,
                closeDialogAction: state.page !== action.payload.page ? null : state.closeDialogAction
            };

        case "LOCATION_SET":
            return {
                ...state,
                location: action.payload.location,
                title: action.payload.title ?? "",
                update: !state.locked ? action.payload.update : state.update && action.payload.update
            };

        case "LOCATION_LOCK":
            return {
                ...state,
                locked: true,
                update: true
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

        case "DIALOG_OPENED":
            return {
                ...state,
                closeDialogAction: action.payload.closeAction
            }

        case "DIALOG_CLOSED":
            return {
                ...state,
                closeDialogAction: null
            }

        default:
            return state;
    }
}

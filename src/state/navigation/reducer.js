import {
    BOTTOM_MENU_HIDE,
    BOTTOM_MENU_SHOW,
    GO_TO_PAGE,
    INIT_FROM_LOCATION,
    INIT_STORAGE,
    LOCATION_LOCK,
    LOCATION_SET,
    LOCATION_UNLOCK
} from "state/navigation/actions";
import { PAGE_TIMELINE } from "state/navigation/pages";

const initialState = {
    standalone: true,
    page: PAGE_TIMELINE,
    location: "",
    title: "",
    update: false,
    locked: false,
    bottomMenuVisible: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_STORAGE:
            return {
                ...state,
                standalone: action.payload.standalone
            };

        case INIT_FROM_LOCATION: {
            let {path, query, hash} = action.payload;
            path = path.startsWith("/moera") ? path.substring(6) : path;
            return {
                ...state,
                location: path + (query ?? "") + (hash ?? "")
            };
        }

        case GO_TO_PAGE:
            return {
                ...state,
                page: action.payload.page,
                bottomMenuVisible: true
            };

        case LOCATION_SET:
            return {
                ...state,
                location: action.payload.location,
                title: action.payload.title,
                update: !state.locked ? action.payload.update : state.update && action.payload.update
            };

        case LOCATION_LOCK:
            return {
                ...state,
                locked: true,
                update: true
            };

        case LOCATION_UNLOCK:
            return {
                ...state,
                locked: false
            };

        case BOTTOM_MENU_HIDE:
            return {
                ...state,
                bottomMenuVisible: false
            }

        case BOTTOM_MENU_SHOW:
            return {
                ...state,
                bottomMenuVisible: true
            }

        default:
            return state;
    }
}

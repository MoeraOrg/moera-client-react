import { GO_TO_PAGE, INIT_STORAGE, LOCATION_LOCK, LOCATION_SET, LOCATION_UNLOCK } from "state/navigation/actions";
import { PAGE_TIMELINE } from "state/navigation/pages";

const initialState = {
    standalone: true,
    page: PAGE_TIMELINE,
    location: "",
    title: "",
    update: false,
    locked: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_STORAGE:
            return {
                ...state,
                standalone: action.payload.standalone
            };

        case GO_TO_PAGE:
            return {
                ...state,
                page: action.payload.page
            };

        case LOCATION_SET:
            return {
                ...state,
                ...action.payload
            };

        case LOCATION_LOCK:
            return {
                ...state,
                locked: true
            };

        case LOCATION_UNLOCK:
            return {
                ...state,
                locked: false
            };

        default:
            return state;
    }
}

import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { toWsUrl } from "util/url";

const initialState = {
    root: {
        location: null,
        page: null,
        api: null,
        events: null
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_FROM_LOCATION: {
            if (!action.payload.rootLocation) {
                return state;
            }

            const location = action.payload.rootLocation;
            const page = location + "/moera";
            const api = page + "/api";
            const events = toWsUrl(api + "/events");
            return {
                ...state,
                root: {
                    location,
                    page,
                    api,
                    events
                }
            };
        }

        default:
            return state;
    }
}

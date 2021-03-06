import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { toWsUrl } from "util/url";
import { NodeState } from "state/node/state";
import { ClientAction } from "state/action";

const initialState = {
    root: {
        location: null,
        page: null,
        api: null,
        events: null
    }
};

export default (state: NodeState = initialState, action: ClientAction): NodeState => {
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

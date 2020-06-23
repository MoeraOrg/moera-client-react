import * as immutable from 'object-path-immutable';

import {
    PEOPLE_GENERAL_LOAD,
    PEOPLE_GENERAL_LOAD_FAILED,
    PEOPLE_GENERAL_LOADED,
    PEOPLE_GO_TO_TAB
} from "state/people/actions";

const initialState = {
    tab: "subscribers",
    loadingGeneral: false,
    loadedGeneral: false,
    subscribersTotal: 0,
    subscriptionsTotal: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case PEOPLE_GO_TO_TAB:
            return immutable.set(state, "tab", action.payload.tab);

        case PEOPLE_GENERAL_LOAD:
            return immutable.set(state, "loadingGeneral", true);

        case PEOPLE_GENERAL_LOADED:
            return immutable.wrap(state)
                .set("loadingGeneral", false)
                .set("loadedGeneral", true)
                .set("subscribersTotal", action.payload.info.feedSubscribersTotal)
                .set("subscriptionsTotal", action.payload.info.feedSubscriptionsTotal)
                .value();

        case PEOPLE_GENERAL_LOAD_FAILED:
            return immutable.set(state, "loadingGeneral", false);

        default:
            return state;
    }
}

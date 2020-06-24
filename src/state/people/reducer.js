import * as immutable from 'object-path-immutable';

import {
    PEOPLE_GENERAL_LOAD,
    PEOPLE_GENERAL_LOAD_FAILED,
    PEOPLE_GENERAL_LOADED,
    PEOPLE_GO_TO_TAB,
    SUBSCRIBERS_LOAD,
    SUBSCRIBERS_LOAD_FAILED,
    SUBSCRIBERS_LOADED,
    SUBSCRIPTIONS_LOAD,
    SUBSCRIPTIONS_LOAD_FAILED,
    SUBSCRIPTIONS_LOADED
} from "state/people/actions";

const initialState = {
    tab: "subscribers",
    loadingGeneral: false,
    loadedGeneral: false,
    subscribersTotal: 0,
    subscriptionsTotal: 0,
    loadingSubscribers: false,
    loadedSubscribers: false,
    subscribers: [],
    loadingSubscriptions: false,
    loadedSubscriptions: false,
    subscriptions: []
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

        case SUBSCRIBERS_LOAD:
            return immutable.set(state, "loadingSubscribers", true);

        case SUBSCRIBERS_LOADED:
            return immutable.wrap(state)
                .set("loadingSubscribers", false)
                .set("loadedSubscribers", true)
                .set("subscribers", action.payload.list)
                .value();

        case SUBSCRIBERS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscribers", false);

        case SUBSCRIPTIONS_LOAD:
            return immutable.set(state, "loadingSubscriptions", true);

        case SUBSCRIPTIONS_LOADED:
            return immutable.wrap(state)
                .set("loadingSubscriptions", false)
                .set("loadedSubscriptions", true)
                .set("subscriptions", action.payload.list)
                .value();

        case SUBSCRIPTIONS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscriptions", false);

        default:
            return state;
    }
}

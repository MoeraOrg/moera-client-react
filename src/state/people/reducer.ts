import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import {
    PEOPLE_GENERAL_LOAD,
    PEOPLE_GENERAL_LOAD_FAILED,
    PEOPLE_GENERAL_LOADED,
    PEOPLE_GENERAL_UNSET,
    PEOPLE_GO_TO_TAB,
    SUBSCRIBERS_LOAD,
    SUBSCRIBERS_LOAD_FAILED,
    SUBSCRIBERS_LOADED,
    SUBSCRIBERS_UNSET,
    SUBSCRIPTIONS_LOAD,
    SUBSCRIPTIONS_LOAD_FAILED,
    SUBSCRIPTIONS_LOADED,
    SUBSCRIPTIONS_UNSET
} from "state/people/actions";
import {
    FEED_SUBSCRIBED,
    FEED_SUBSCRIBER_UPDATED,
    FEED_SUBSCRIPTION_UPDATED,
    FEED_UNSUBSCRIBED
} from "state/feeds/actions";
import {
    EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED,
    EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED,
    EVENT_NODE_SUBSCRIBER_ADDED,
    EVENT_NODE_SUBSCRIBER_DELETED,
    EVENT_NODE_SUBSCRIPTION_ADDED,
    EVENT_NODE_SUBSCRIPTION_DELETED
} from "api/events/actions";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { subscriptionToSubscriber } from "state/feeds/selectors";
import { PeopleState } from "state/people/state";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

const initialState: PeopleState = {
    tab: "subscribers",
    loadingGeneral: false,
    loadedGeneral: false,
    subscribersTotal: null,
    subscriptionsTotal: null,
    loadingSubscribers: false,
    loadedSubscribers: false,
    subscribers: [],
    loadingSubscriptions: false,
    loadedSubscriptions: false,
    subscriptions: [],
    operations: {}
};

function sortSubscribers(list: SubscriberInfo[]): SubscriberInfo[] {
    if (list) {
        list.sort((sr1, sr2) => {
            const sr1name = sr1.fullName || sr1.nodeName;
            const sr2name = sr2.fullName || sr2.nodeName;
            return sr1name.localeCompare(sr2name);
        });
    }
    return list;
}

function sortSubscriptions(list: SubscriptionInfo[]): SubscriptionInfo[] {
    if (list) {
        list.sort((sr1, sr2) => {
            const sr1name = sr1.remoteFullName || sr1.remoteNodeName;
            const sr2name = sr2.remoteFullName || sr2.remoteNodeName;
            return sr1name.localeCompare(sr2name);
        });
    }
    return list;
}

export default (state: PeopleState = initialState, action: WithContext<ClientAction>): PeopleState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return cloneDeep(initialState);

        case PEOPLE_GO_TO_TAB:
            return immutable.set(state, "tab", action.payload.tab);

        case PEOPLE_GENERAL_LOAD:
            return immutable.set(state, "loadingGeneral", true);

        case PEOPLE_GENERAL_LOADED:
            return immutable.assign(state, "", {
                loadingGeneral: false,
                loadedGeneral: true,
                subscribersTotal: action.payload.info.feedSubscribersTotal ?? null,
                subscriptionsTotal: action.payload.info.feedSubscriptionsTotal ?? null,
                operations: action.payload.info.operations ?? {}
            });

        case PEOPLE_GENERAL_LOAD_FAILED:
            return immutable.set(state, "loadingGeneral", false);

        case PEOPLE_GENERAL_UNSET:
            return immutable.assign(state, "", {
                loadedGeneral: false,
                subscribersTotal: null,
                subscriptionsTotal: null,
                operations: {}
            });

        case SUBSCRIBERS_LOAD:
            return immutable.set(state, "loadingSubscribers", true);

        case SUBSCRIBERS_LOADED:
            return immutable.assign(state, "", {
                loadingSubscribers: false,
                loadedSubscribers: true,
                subscribers: sortSubscribers(action.payload.list)
            });

        case SUBSCRIBERS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscribers", false);

        case SUBSCRIBERS_UNSET:
            return immutable.assign(state, "", {
                loadedSubscribers: false,
                subscribers: []
            });

        case SUBSCRIPTIONS_LOAD:
            return immutable.set(state, "loadingSubscriptions", true);

        case SUBSCRIPTIONS_LOADED:
            return immutable.assign(state, "", {
                loadingSubscriptions: false,
                loadedSubscriptions: true,
                subscriptions: sortSubscriptions(action.payload.list)
            });

        case SUBSCRIPTIONS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscriptions", false);

        case SUBSCRIPTIONS_UNSET:
            return immutable.assign(state, "", {
                loadedSubscriptions: false,
                subscriptions: []
            });

        case FEED_SUBSCRIBED: {
            const istate = immutable.wrap(state);
            if (state.loadedSubscribers) {
                let subscribers = state.subscribers;
                if (action.context.ownerName === action.payload.nodeName && action.context.homeOwnerName != null) {
                    subscribers = state.subscribers
                        .filter(sr => sr.id !== action.payload.subscription.remoteSubscriberId);
                    subscribers.push(subscriptionToSubscriber(action.payload.subscription,
                        action.context.homeOwnerName, action.context.homeOwnerFullName, action.context.homeOwnerAvatar));
                }
                if (subscribers.length !== state.subscribers.length) {
                    sortSubscribers(subscribers);
                    istate.set("subscribers", subscribers)
                        .set("subscribersTotal", subscribers.length);
                }
            }
            if (state.loadedSubscriptions) {
                let subscriptions = state.subscriptions;
                if (action.context.ownerName === action.context.homeOwnerName) {
                    subscriptions = state.subscriptions
                        .filter(sr => sr.remoteNodeName !== action.payload.nodeName);
                    subscriptions.push(cloneDeep(action.payload.subscription));
                }
                if (subscriptions.length !== state.subscriptions.length) {
                    sortSubscriptions(subscriptions);
                    istate.set("subscriptions", subscriptions)
                        .set("subscriptionsTotal", subscriptions.length);
                }
            }
            return istate.value();
        }

        case FEED_UNSUBSCRIBED: {
            const istate = immutable.wrap(state);
            if (state.loadedSubscribers) {
                let subscribers = state.subscribers;
                if (action.context.ownerName === action.payload.nodeName) {
                    subscribers = subscribers.filter(
                        sr => sr.nodeName !== action.context.homeOwnerName
                            || sr.feedName !== action.payload.feedName
                    );
                }
                if (subscribers.length !== state.subscribers.length) {
                    istate.set("subscribers", subscribers)
                        .set("subscribersTotal", subscribers.length);
                }
            }
            if (state.loadedSubscriptions) {
                let subscriptions = state.subscriptions;
                if (action.context.ownerName === action.context.homeOwnerName) {
                    subscriptions = subscriptions.filter(
                        sr => sr.remoteNodeName !== action.payload.nodeName
                            || sr.remoteFeedName !== action.payload.feedName
                    );
                }
                if (subscriptions.length !== state.subscriptions.length) {
                    istate.set("subscriptions", subscriptions)
                        .set("subscriptionsTotal", subscriptions.length);
                }
            }
            return istate.value();
        }

        case FEED_SUBSCRIBER_UPDATED: {
            const {nodeName, subscriber} = action.payload;
            const {ownerName} = action.context;
            if (state.loadedSubscribers && nodeName === ownerName) {
                const subscribers = state.subscribers
                    .map(
                        sr => sr.nodeName === subscriber.nodeName && sr.feedName === subscriber.feedName
                            ? subscriber
                            : sr
                    );
                return immutable.set(state, "subscribers", subscribers);
            }
            return state;
        }

        case FEED_SUBSCRIPTION_UPDATED: {
            const {nodeName, subscription} = action.payload;
            const {ownerName} = action.context;
            if (state.loadedSubscriptions && nodeName === ownerName) {
                const subscriptions = state.subscriptions
                    .map(
                        sr => sr.remoteNodeName === subscription.remoteNodeName && sr.feedName === subscription.feedName
                            ? subscription
                            : sr
                    );
                return immutable.set(state, "subscriptions", subscriptions);
            }
            return state;
        }

        case EVENT_NODE_SUBSCRIBER_ADDED:
            if (state.loadedSubscribers && action.payload.subscriber.type === "feed") {
                const subscribers = state.subscribers.filter(sr => sr.id !== action.payload.subscriber.id);
                subscribers.push(cloneDeep(action.payload.subscriber));
                sortSubscribers(subscribers);
                return immutable.wrap(state)
                    .set("subscribers", subscribers)
                    .set("subscribersTotal", subscribers.length)
                    .value()
            }
            return state;

        case EVENT_NODE_SUBSCRIBER_DELETED:
            if (state.loadedSubscribers && action.payload.subscriber.type === "feed") {
                const subscribers = state.subscribers.filter(sr => sr.id !== action.payload.subscriber.id);
                if (subscribers.length !== state.subscribers.length) {
                    return immutable.wrap(state)
                        .set("subscribers", subscribers)
                        .set("subscribersTotal", subscribers.length)
                        .value();
                }
            }
            return state;

        case EVENT_NODE_SUBSCRIPTION_ADDED:
            if (state.loadedSubscriptions && action.payload.subscription.type === "feed") {
                const subscriptions = state.subscriptions.filter(sr => sr.id !== action.payload.subscription.id);
                subscriptions.push(cloneDeep(action.payload.subscription));
                sortSubscriptions(subscriptions);
                return immutable.wrap(state)
                    .set("subscriptions", subscriptions)
                    .set("subscriptionsTotal", subscriptions.length)
                    .value()
            }
            return state;

        case EVENT_NODE_SUBSCRIPTION_DELETED:
            if (state.loadedSubscriptions && action.payload.subscription.type === "feed") {
                const subscriptions = state.subscriptions.filter(sr => sr.id !== action.payload.subscription.id);
                if (subscriptions.length !== state.subscriptions.length) {
                    return immutable.wrap(state)
                        .set("subscriptions", subscriptions)
                        .set("subscriptionsTotal", subscriptions.length)
                        .value();
                }
            }
            return state;

        case EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED:
            if (state.loadedSubscribers || state.loadedSubscriptions) {
                const istate = immutable.wrap(state);
                if (state.loadedSubscribers) {
                    const index = state.subscribers.findIndex(sr => sr.nodeName === action.payload.name);
                    if (index >= 0) {
                        istate.update(["subscribers", index],
                            sr => ({...sr, fullName: action.payload.fullName}));
                    }
                }
                if (state.loadedSubscriptions) {
                    const index = state.subscriptions.findIndex(sr => sr.remoteNodeName === action.payload.name);
                    if (index >= 0) {
                        istate.update(["subscriptions", index],
                            sr => ({...sr, fullName: action.payload.fullName}));
                    }
                }
                return istate.value();
            }
            return state;

        case EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED:
            if (state.loadedSubscribers || state.loadedSubscriptions) {
                const istate = immutable.wrap(state);
                if (state.loadedSubscribers) {
                    const index = state.subscribers.findIndex(sr => sr.nodeName === action.payload.name);
                    if (index >= 0) {
                        istate.update(["subscribers", index],
                            sr => ({...sr, avatar: cloneDeep(action.payload.avatar)}));
                    }
                }
                if (state.loadedSubscriptions) {
                    const index = state.subscriptions.findIndex(sr => sr.remoteNodeName === action.payload.name);
                    if (index >= 0) {
                        istate.update(["subscriptions", index],
                            sr => ({...sr, avatar: cloneDeep(action.payload.avatar)}));
                    }
                }
                return istate.value();
            }
            return state;

        default:
            return state;
    }
}

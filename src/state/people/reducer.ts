import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';
import {
    EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED,
    EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED,
    EVENT_NODE_SUBSCRIBER_ADDED,
    EVENT_NODE_SUBSCRIBER_DELETED,
    EVENT_NODE_SUBSCRIPTION_ADDED,
    EVENT_NODE_SUBSCRIPTION_DELETED
} from "api/events/actions";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import {
    PEOPLE_GENERAL_LOAD,
    PEOPLE_GENERAL_LOAD_FAILED,
    PEOPLE_GENERAL_LOADED,
    PEOPLE_GENERAL_UNSET,
    PEOPLE_GO_TO_TAB,
    PEOPLE_UNSET,
    SUBSCRIBERS_LOAD,
    SUBSCRIBERS_LOAD_FAILED,
    SUBSCRIBERS_LOADED,
    SUBSCRIPTIONS_LOAD,
    SUBSCRIPTIONS_LOAD_FAILED,
    SUBSCRIPTIONS_LOADED
} from "state/people/actions";
import { ContactState, PeopleState } from "state/people/state";
import {
    FEED_SUBSCRIBED,
    FEED_SUBSCRIBER_UPDATED,
    FEED_SUBSCRIPTION_UPDATED,
    FEED_UNSUBSCRIBED
} from "state/feeds/actions";
import { INIT_FROM_LOCATION } from "state/navigation/actions";

const initialState: PeopleState = {
    tab: "subscribers",
    loadingGeneral: false,
    loadedGeneral: false,
    subscribersTotal: null,
    subscriptionsTotal: null,
    loadingSubscribers: false,
    loadedSubscribers: false,
    loadingSubscriptions: false,
    loadedSubscriptions: false,
    contacts: {},
    operations: {}
};

function prepareContact(state: PeopleState, istate: WrappedObject<PeopleState>, nodeName: string): ContactState {
    let contact = state.contacts[nodeName];
    if (contact == null) {
        contact = {
            contact: {nodeName, closeness: 0},
            subscriber: null,
            subscription: null
        };
        istate.set(["contacts", nodeName], contact);
    }
    return contact;
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

        case PEOPLE_UNSET:
            return immutable.assign(state, "", {
                loadedGeneral: false,
                subscribersTotal: null,
                subscriptionsTotal: null,
                loadedSubscribers: false,
                loadedSubscriptions: false,
                contacts: {},
                operations: {}
            });

        case SUBSCRIBERS_LOAD:
            return immutable.set(state, "loadingSubscribers", true);

        case SUBSCRIBERS_LOADED: {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingSubscribers: false,
                loadedSubscribers: true
            });
            action.payload.list.forEach(subscriber => {
                prepareContact(state, istate, subscriber.nodeName);
                if (subscriber.contact != null) {
                    istate.set(["contacts", subscriber.nodeName, "contact"], subscriber.contact);
                    delete subscriber.contact;
                }
                istate.set(["contacts", subscriber.nodeName, "subscriber"], subscriber);
            });
            return istate.value();
        }

        case SUBSCRIBERS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscribers", false);

        case SUBSCRIPTIONS_LOAD:
            return immutable.set(state, "loadingSubscriptions", true);

        case SUBSCRIPTIONS_LOADED: {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingSubscriptions: false,
                loadedSubscriptions: true,
            });
            action.payload.list.forEach(subscription => {
                prepareContact(state, istate, subscription.remoteNodeName);
                if (subscription.contact != null) {
                    istate.set(["contacts", subscription.remoteNodeName, "contact"], subscription.contact);
                    delete subscription.contact;
                }
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            });
            return istate.value();
        }

        case SUBSCRIPTIONS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscriptions", false);

        case FEED_SUBSCRIBED: {
            if (action.context.ownerName !== action.context.homeOwnerName) {
                return state;
            }

            const istate = immutable.wrap(state);
            const contact = prepareContact(state, istate, action.payload.nodeName);
            const subscription = cloneDeep(action.payload.subscription);
            if (subscription.contact != null) {
                istate.set(["contacts", subscription.remoteNodeName, "contact"], subscription.contact);
                delete subscription.contact;
            }
            istate.set(["contacts", action.payload.nodeName, "subscription"], subscription);
            if (state.loadedSubscriptions && contact.subscription == null) {
                istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 0) + 1);
            }
            return istate.value();
        }

        case FEED_UNSUBSCRIBED: {
            const istate = immutable.wrap(state);
            if (action.context.ownerName === action.payload.nodeName && action.context.homeOwnerName != null) {
                const contact = prepareContact(state, istate, action.context.homeOwnerName);
                if (contact.subscriber != null && contact.subscriber.feedName === action.payload.feedName) {
                    istate.set(["contacts", action.context.homeOwnerName, "subscriber"], null);
                    if (state.loadedSubscribers) {
                        istate.set("subscribersTotal", (state.subscribersTotal ?? 1) - 1);
                    }
                }
            }
            if (action.context.ownerName === action.context.homeOwnerName) {
                const contact = prepareContact(state, istate, action.payload.nodeName);
                if (contact.subscription != null && contact.subscription.remoteFeedName === action.payload.feedName) {
                    istate.set(["contacts", action.payload.nodeName, "subscription"], null);
                    if (state.loadedSubscriptions) {
                        istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 1) - 1);
                    }
                }
            }
            return istate.value();
        }

        case FEED_SUBSCRIBER_UPDATED: {
            if (action.payload.nodeName !== action.context.ownerName) {
                return state;
            }

            const istate = immutable.wrap(state);
            const subscriber = cloneDeep(action.payload.subscriber);
            const contact = prepareContact(state, istate, subscriber.nodeName);
            if (subscriber.contact != null) {
                istate.set(["contacts", subscriber.nodeName, "contact"], subscriber.contact);
                delete subscriber.contact;
            }
            if (contact.subscriber == null || contact.subscriber.feedName === subscriber.feedName) {
                istate.set(["contacts", subscriber.nodeName, "subscriber"], subscriber);
            }
            return istate.value();
        }

        case FEED_SUBSCRIPTION_UPDATED: {
            if (action.payload.nodeName !== action.context.ownerName) {
                return state;
            }

            const istate = immutable.wrap(state);
            const subscription = cloneDeep(action.payload.subscription);
            const contact = prepareContact(state, istate, subscription.remoteNodeName);
            if (subscription.contact != null) {
                istate.set(["contacts", subscription.remoteNodeName, "contact"], subscription.contact);
                delete subscription.contact;
            }
            if (contact.subscription == null || contact.subscription.remoteFeedName === subscription.remoteFeedName) {
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIBER_ADDED: {
            if (action.payload.subscriber.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const subscriber = cloneDeep(action.payload.subscriber);
            const contact = prepareContact(state, istate, subscriber.nodeName);
            if (subscriber.contact != null) {
                istate.set(["contacts", subscriber.nodeName, "contact"], subscriber.contact);
                delete subscriber.contact;
            }
            istate.set(["contacts", subscriber.nodeName, "subscriber"], subscriber);
            if (state.loadedSubscribers && contact.subscriber == null) {
                istate.set("subscribersTotal", (state.subscribersTotal ?? 0) + 1);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIBER_DELETED: {
            const {subscriber} = action.payload;
            if (subscriber.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const contact = prepareContact(state, istate, subscriber.nodeName);
            if (contact.subscriber != null && contact.subscriber.id === subscriber.id) {
                istate.set(["contacts", subscriber.nodeName, "subscriber"], null);
                if (state.loadedSubscribers) {
                    istate.set("subscribersTotal", (state.subscribersTotal ?? 1) - 1);
                }
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIPTION_ADDED: {
            if (action.payload.subscription.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const subscription = cloneDeep(action.payload.subscription);
            const contact = prepareContact(state, istate, subscription.remoteNodeName);
            if (subscription.contact != null) {
                istate.set(["contacts", subscription.remoteNodeName, "contact"], subscription.contact);
                delete subscription.contact;
            }
            istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            if (state.loadedSubscriptions && contact.subscription == null) {
                istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 0) + 1);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIPTION_DELETED: {
            const {subscription} = action.payload;
            if (subscription.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const contact = prepareContact(state, istate, subscription.remoteNodeName);
            if (contact.subscription != null && contact.subscription.id === subscription.id) {
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], null);
                if (state.loadedSubscriptions) {
                    istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 1) - 1);
                }
            }
            return istate.value();
        }

        case EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED: {
            const {name, fullName} = action.payload;

            const istate = immutable.wrap(state);
            const contact = prepareContact(state, istate, name);
            istate.set(["contacts", name, "contact", "fullName"], fullName);
            if (contact.subscriber != null) {
                istate.set(["contacts", name, "subscriber", "fullName"], fullName); // FIXME to be removed
            }
            if (contact.subscription != null) {
                istate.set(["contacts", name, "subscription", "remoteFullName"], fullName); // FIXME to be removed
            }
            return istate.value();
        }

        case EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED: {
            const {name} = action.payload;
            const avatar = cloneDeep(action.payload.avatar);

            const istate = immutable.wrap(state);
            const contact = prepareContact(state, istate, name);
            istate.set(["contacts", name, "contact", "avatar"], avatar);
            if (contact.subscriber != null) {
                istate.set(["contacts", name, "subscriber", "avatar"], avatar); // FIXME to be removed
            }
            if (contact.subscription != null) {
                istate.set(["contacts", name, "subscription", "remoteAvatar"], avatar); // FIXME to be removed
            }
            return istate.value();
        }

        default:
            return state;
    }
}

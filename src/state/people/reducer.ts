import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { ContactInfo, FriendInfo } from "api/node/api-types";
import {
    EVENT_NODE_FRIENDSHIP_UPDATED,
    EVENT_NODE_REMOTE_FRIENDSHIP_UPDATED,
    EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED,
    EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED,
    EVENT_NODE_SUBSCRIBER_ADDED,
    EVENT_NODE_SUBSCRIBER_DELETED,
    EVENT_NODE_SUBSCRIBER_UPDATED,
    EVENT_NODE_SUBSCRIPTION_ADDED,
    EVENT_NODE_SUBSCRIPTION_DELETED,
    EVENT_NODE_SUBSCRIPTION_UPDATED
} from "api/events/actions";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import {
    FEED_SUBSCRIBED,
    FEED_SUBSCRIBER_UPDATED,
    FEED_SUBSCRIPTION_UPDATED,
    FEED_UNSUBSCRIBED
} from "state/feeds/actions";
import {
    FRIEND_OFS_LOAD,
    FRIEND_OFS_LOAD_FAILED,
    FRIEND_OFS_LOADED,
    FRIENDS_LOAD,
    FRIENDS_LOAD_FAILED,
    FRIENDS_LOADED,
    FRIENDSHIP_UPDATED,
    PEOPLE_GENERAL_LOAD,
    PEOPLE_GENERAL_LOAD_FAILED,
    PEOPLE_GENERAL_LOADED,
    PEOPLE_GENERAL_UNSET,
    PEOPLE_GO_TO_TAB,
    PEOPLE_SELECT_TOGGLE,
    PEOPLE_SELECTED_PROCEEDED,
    PEOPLE_SELECTED_SUBSCRIBE,
    PEOPLE_SELECTED_UNSUBSCRIBE,
    PEOPLE_START_SELECTION,
    PEOPLE_STOP_SELECTION,
    PEOPLE_UNSET,
    SUBSCRIBERS_LOAD,
    SUBSCRIBERS_LOAD_FAILED,
    SUBSCRIBERS_LOADED,
    SUBSCRIPTIONS_LOAD,
    SUBSCRIPTIONS_LOAD_FAILED,
    SUBSCRIPTIONS_LOADED
} from "state/people/actions";
import { ContactState, PeopleState } from "state/people/state";

const initialState: PeopleState = {
    tab: "subscribers",
    loadingGeneral: false,
    loadedGeneral: false,
    subscribersTotal: null,
    subscriptionsTotal: null,
    friendsTotal: null,
    friendOfsTotal: null,
    loadingSubscribers: false,
    loadedSubscribers: false,
    loadingSubscriptions: false,
    loadedSubscriptions: false,
    loadingFriends: false,
    loadedFriends: false,
    loadingFriendOfs: false,
    loadedFriendOfs: false,
    contacts: {},
    operations: {},
    selecting: false,
    selected: {},
    selectedProceeding: false
};

function prepareContact(state: PeopleState, istate: WrappedObject<PeopleState>, nodeName: string): ContactState {
    let contact = state.contacts[nodeName];
    if (contact == null) {
        contact = {
            contact: {nodeName, closeness: 0},
            subscriber: null,
            subscription: null,
            friend: null,
            friendOf: null
        };
        istate.set(["contacts", nodeName], contact);
    }
    return contact;
}

const isRemoved = (contact: ContactInfo | null | undefined): boolean =>
    contact == null
    || (!contact.hasFeedSubscriber && !contact.hasFeedSubscription && !contact.hasFriend && !contact.hasFriendOf);

function putContact(state: PeopleState, istate: WrappedObject<PeopleState>, nodeName: string,
                    contact: ContactInfo): void {
    istate.set(["contacts", nodeName, "contact"], contact);
    if (state.selected[nodeName] && isRemoved(contact)) {
        istate.set(["selected", nodeName], false);
    }
}

function updateFriendship(state: PeopleState, friend: FriendInfo): PeopleState {
    const istate = immutable.wrap(state);

    prepareContact(state, istate, friend.nodeName);
    if (friend.contact != null) {
        putContact(state, istate, friend.nodeName, friend.contact);
        delete friend.contact;
    }
    if (friend.groups != null && friend.groups.length > 0) {
        istate.set(["contacts", friend.nodeName, "friend"], friend);
    } else {
        istate.set(["contacts", friend.nodeName, "friend"], null);
    }

    if (state.loadedGeneral) {
        const totals: Partial<Record<string, number>> = cloneDeep(state.friendsTotal) ?? {};
        state.contacts[friend.nodeName]?.friend?.groups?.forEach(g => totals[g.id] = (totals[g.id] ?? 1) - 1);
        friend.groups?.forEach(g => totals[g.id] = (totals[g.id] ?? 0) + 1);
        istate.set("friendsTotal", totals);
    }

    return istate.value();
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
                friendsTotal: action.payload.info.friendsTotal ?? null,
                friendOfsTotal: action.payload.info.friendOfsTotal ?? null,
                operations: action.payload.info.operations ?? {}
            });

        case PEOPLE_GENERAL_LOAD_FAILED:
            return immutable.set(state, "loadingGeneral", false);

        case PEOPLE_GENERAL_UNSET:
            return immutable.assign(state, "", {
                loadedGeneral: false,
                subscribersTotal: null,
                subscriptionsTotal: null,
                friendsTotal: null,
                friendOfsTotal: null,
                operations: {}
            });

        case PEOPLE_UNSET:
            return immutable.assign(state, "", {
                loadedGeneral: false,
                subscribersTotal: null,
                subscriptionsTotal: null,
                friendsTotal: null,
                friendOfsTotal: null,
                loadedSubscribers: false,
                loadedSubscriptions: false,
                contacts: {},
                operations: {},
                selecting: false,
                selected: {}
            });

        case PEOPLE_START_SELECTION:
            return immutable.set(state, "selecting", true);

        case PEOPLE_STOP_SELECTION:
            return immutable.assign(state, "", {
                selecting: false,
                selected: {}
            });

        case PEOPLE_SELECT_TOGGLE:
            return immutable.update(
                state,
                ["selected", action.payload.nodeName],
                (v: boolean | null | undefined) => !v
            );

        case PEOPLE_SELECTED_SUBSCRIBE:
        case PEOPLE_SELECTED_UNSUBSCRIBE:
            return immutable.set(state, "selectedProceeding", true);

        case PEOPLE_SELECTED_PROCEEDED:
            return immutable.set(state, "selectedProceeding", false);

        case SUBSCRIBERS_LOAD:
            return immutable.set(state, "loadingSubscribers", true);

        case SUBSCRIBERS_LOADED: {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingSubscribers: false,
                loadedSubscribers: true,
                subscribersTotal: action.payload.list.length
            });
            action.payload.list.forEach(subscriber => {
                prepareContact(state, istate, subscriber.nodeName);
                if (subscriber.contact != null) {
                    putContact(state, istate, subscriber.nodeName, subscriber.contact);
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
                subscriptionsTotal: action.payload.list.length
            });
            action.payload.list.forEach(subscription => {
                prepareContact(state, istate, subscription.remoteNodeName);
                if (subscription.contact != null) {
                    putContact(state, istate, subscription.remoteNodeName, subscription.contact);
                    delete subscription.contact;
                }
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            });
            return istate.value();
        }

        case SUBSCRIPTIONS_LOAD_FAILED:
            return immutable.set(state, "loadingSubscriptions", false);

        case FRIENDS_LOAD:
            return immutable.set(state, "loadingFriends", true);

        case FRIENDS_LOADED: {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingFriends: false,
                loadedFriends: true
            });
            const totals: Partial<Record<string, number>> = {};
            action.payload.list.forEach(friend => {
                prepareContact(state, istate, friend.nodeName);
                if (friend.contact != null) {
                    putContact(state, istate, friend.nodeName, friend.contact);
                    delete friend.contact;
                }
                istate.set(["contacts", friend.nodeName, "friend"], friend);
                friend.groups?.forEach(g => totals[g.id] = (totals[g.id] ?? 0) + 1);
            });
            istate.set("friendsTotal", totals);
            return istate.value();
        }

        case FRIENDS_LOAD_FAILED:
            return immutable.set(state, "loadingFriends", false);

        case FRIEND_OFS_LOAD:
            return immutable.set(state, "loadingFriendOfs", true);

        case FRIEND_OFS_LOADED: {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingFriendOfs: false,
                loadedFriendOfs: true,
                friendOfsTotal: action.payload.list.length
            });
            action.payload.list.forEach(friendOf => {
                prepareContact(state, istate, friendOf.remoteNodeName);
                if (friendOf.contact != null) {
                    putContact(state, istate, friendOf.remoteNodeName, friendOf.contact);
                    delete friendOf.contact;
                }
                istate.set(["contacts", friendOf.remoteNodeName, "friendOf"], friendOf);
            });
            return istate.value();
        }

        case FRIEND_OFS_LOAD_FAILED:
            return immutable.set(state, "loadingFriendOfs", false);

        case FEED_SUBSCRIBED: {
            if (action.context.ownerName !== action.context.homeOwnerName) {
                return state;
            }
            const istate = immutable.wrap(state);
            const contactState = prepareContact(state, istate, action.payload.nodeName);
            const subscription = cloneDeep(action.payload.subscription);
            if (subscription.contact != null) {
                putContact(state, istate, subscription.remoteNodeName, subscription.contact);
                delete subscription.contact;
            }
            istate.set(["contacts", action.payload.nodeName, "subscription"], subscription);
            if (state.loadedGeneral && state.loadedSubscriptions && contactState.subscription == null) {
                istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 0) + 1);
            }
            return istate.value();
        }

        case FEED_UNSUBSCRIBED: {
            const istate = immutable.wrap(state);
            if (action.context.ownerName === action.payload.nodeName && action.context.homeOwnerName != null) {
                const contactState = prepareContact(state, istate, action.context.homeOwnerName);
                if (action.payload.contact != null) {
                    putContact(state, istate, action.context.homeOwnerName, action.payload.contact);
                }
                if (contactState.subscriber != null && contactState.subscriber.feedName === action.payload.feedName) {
                    istate.set(["contacts", action.context.homeOwnerName, "subscriber"], null);
                    if (state.loadedGeneral && state.loadedSubscribers) {
                        istate.set("subscribersTotal", (state.subscribersTotal ?? 1) - 1);
                    }
                }
            }
            if (action.context.ownerName === action.context.homeOwnerName) {
                const contactState = prepareContact(state, istate, action.payload.nodeName);
                if (action.payload.contact != null) {
                    putContact(state, istate, action.payload.nodeName, action.payload.contact);
                }
                if (contactState.subscription != null
                        && contactState.subscription.remoteFeedName === action.payload.feedName) {
                    istate.set(["contacts", action.payload.nodeName, "subscription"], null);
                    if (state.loadedGeneral && state.loadedSubscriptions) {
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
            const contactState = prepareContact(state, istate, subscriber.nodeName);
            if (subscriber.contact != null) {
                putContact(state, istate, subscriber.nodeName, subscriber.contact);
                delete subscriber.contact;
            }
            if (contactState.subscriber == null || contactState.subscriber.feedName === subscriber.feedName) {
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
            const contactState = prepareContact(state, istate, subscription.remoteNodeName);
            if (subscription.contact != null) {
                putContact(state, istate, subscription.remoteNodeName, subscription.contact);
                delete subscription.contact;
            }
            if (contactState.subscription == null
                    || contactState.subscription.remoteFeedName === subscription.remoteFeedName) {
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            }
            return istate.value();
        }

        case FRIENDSHIP_UPDATED:
            if (action.context.ownerName === action.context.homeOwnerName) {
                return updateFriendship(state, action.payload.friend);
            }
            return state;

        case EVENT_NODE_SUBSCRIBER_ADDED: {
            if (action.payload.subscriber.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const subscriber = cloneDeep(action.payload.subscriber);
            const contactState = prepareContact(state, istate, subscriber.nodeName);
            if (subscriber.contact != null) {
                putContact(state, istate, subscriber.nodeName, subscriber.contact);
                delete subscriber.contact;
            }
            istate.set(["contacts", subscriber.nodeName, "subscriber"], subscriber);
            if (state.loadedGeneral && state.loadedSubscribers && contactState.subscriber == null) {
                istate.set("subscribersTotal", (state.subscribersTotal ?? 0) + 1);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIBER_UPDATED: {
            const {subscriber} = action.payload;
            if (subscriber.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const contactState = prepareContact(state, istate, subscriber.nodeName);
            if (subscriber.contact != null) {
                putContact(state, istate, subscriber.nodeName, subscriber.contact);
                delete subscriber.contact;
            }
            if (contactState.subscriber == null || contactState.subscriber.id === subscriber.id) {
                istate.set(["contacts", subscriber.nodeName, "subscriber"], subscriber);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIBER_DELETED: {
            const {subscriber} = action.payload;
            if (subscriber.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const contactState = prepareContact(state, istate, subscriber.nodeName);
            if (subscriber.contact != null) {
                putContact(state, istate, subscriber.nodeName, subscriber.contact);
                delete subscriber.contact;
            }
            if (contactState.subscriber != null && contactState.subscriber.id === subscriber.id) {
                istate.set(["contacts", subscriber.nodeName, "subscriber"], null);
                if (state.loadedGeneral && state.loadedSubscribers) {
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
            const contactState = prepareContact(state, istate, subscription.remoteNodeName);
            if (subscription.contact != null) {
                putContact(state, istate, subscription.remoteNodeName, subscription.contact);
                delete subscription.contact;
            }
            istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            if (state.loadedGeneral && state.loadedSubscriptions && contactState.subscription == null) {
                istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 0) + 1);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIPTION_UPDATED: {
            const {subscription} = action.payload;
            if (subscription.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const contactState = prepareContact(state, istate, subscription.remoteNodeName);
            if (subscription.contact != null) {
                putContact(state, istate, subscription.remoteNodeName, subscription.contact);
                delete subscription.contact;
            }
            if (contactState.subscription == null || contactState.subscription.id === subscription.id) {
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], subscription);
            }
            return istate.value();
        }

        case EVENT_NODE_SUBSCRIPTION_DELETED: {
            const {subscription} = action.payload;
            if (subscription.type !== "feed") {
                return state;
            }

            const istate = immutable.wrap(state);
            const contactState = prepareContact(state, istate, subscription.remoteNodeName);
            if (subscription.contact != null) {
                putContact(state, istate, subscription.remoteNodeName, subscription.contact);
                delete subscription.contact;
            }
            if (contactState.subscription != null && contactState.subscription.id === subscription.id) {
                istate.set(["contacts", subscription.remoteNodeName, "subscription"], null);
                if (state.loadedGeneral && state.loadedSubscriptions) {
                    istate.set("subscriptionsTotal", (state.subscriptionsTotal ?? 1) - 1);
                }
            }
            return istate.value();
        }

        case EVENT_NODE_FRIENDSHIP_UPDATED:
            return updateFriendship(state, action.payload.friend);

        case EVENT_NODE_REMOTE_FRIENDSHIP_UPDATED: {
            const {friendOf} = action.payload;

            const istate = immutable.wrap(state);
            const contactState = prepareContact(state, istate, friendOf.remoteNodeName);
            if (friendOf.contact != null) {
                putContact(state, istate, friendOf.remoteNodeName, friendOf.contact);
                delete friendOf.contact;
            }
            if (friendOf.groups != null && friendOf.groups.length > 0) {
                istate.set(["contacts", friendOf.remoteNodeName, "friendOf"], friendOf);
                if (state.loadedGeneral && state.loadedFriendOfs && contactState.friendOf == null) {
                    istate.set("friendOfsTotal", (state.friendOfsTotal ?? 0) + 1);
                }
            } else {
                istate.set(["contacts", friendOf.remoteNodeName, "friendOf"], null);
                if (state.loadedGeneral && state.loadedFriendOfs && contactState.friendOf != null) {
                    istate.set("friendOfsTotal", (state.friendOfsTotal ?? 1) - 1);
                }
            }
            return istate.value();
        }

        case EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED: {
            const {name, fullName} = action.payload;

            const istate = immutable.wrap(state);
            prepareContact(state, istate, name);
            istate.set(["contacts", name, "contact", "fullName"], fullName);
            return istate.value();
        }

        case EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED: {
            const {name} = action.payload;
            const avatar = cloneDeep(action.payload.avatar);

            const istate = immutable.wrap(state);
            prepareContact(state, istate, name);
            istate.set(["contacts", name, "contact", "avatar"], avatar);
            return istate.value();
        }

        default:
            return state;
    }
}

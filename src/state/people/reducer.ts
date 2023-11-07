import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { BlockedByUserInfo, BlockedUserInfo, ContactInfo, FriendInfo } from "api";
import {
    EVENT_NODE_BLOCKED_BY_USER_ADDED,
    EVENT_NODE_BLOCKED_BY_USER_DELETED,
    EVENT_NODE_BLOCKED_USER_ADDED,
    EVENT_NODE_BLOCKED_USER_DELETED,
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
} from "api/events";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { ContactState, PeopleState } from "state/people/state";
import { nameListQueryToRegexes } from "util/names-list";

const initialState: PeopleState = {
    tab: "subscribers",
    loadingGeneral: false,
    loadedGeneral: false,
    subscribersTotal: null,
    subscriptionsTotal: null,
    friendsTotal: null,
    friendOfsTotal: null,
    blockedTotal: null,
    blockedByTotal: null,
    loadingSubscribers: false,
    loadedSubscribers: false,
    loadingSubscriptions: false,
    loadedSubscriptions: false,
    loadingFriends: false,
    loadedFriends: false,
    loadingFriendOfs: false,
    loadedFriendOfs: false,
    loadingBlocked: false,
    loadedBlocked: false,
    loadingBlockedBy: false,
    loadedBlockedBy: false,
    contacts: {},
    operations: {},
    selecting: false,
    selected: {},
    searchRegexes: [],
    sortAlpha: false
};

function prepareContact(state: PeopleState, istate: WrappedObject<PeopleState>, nodeName: string): ContactState {
    let contact = state.contacts[nodeName];
    if (contact == null) {
        contact = {
            contact: {nodeName, closeness: 0},
            subscriber: null,
            subscription: null,
            friend: null,
            friendOf: null,
            blocked: null,
            blockedBy: null
        };
        istate.set(["contacts", nodeName], contact);
    }
    return contact;
}

const isRemoved = (contact: ContactInfo | null | undefined): boolean =>
    contact == null
    || (!contact.hasFeedSubscriber && !contact.hasFeedSubscription && !contact.hasFriend && !contact.hasFriendOf
        && !contact.hasBlock && !contact.hasBlockBy);

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

function cloneBlocked(list: BlockedUserInfo[]): BlockedUserInfo[] {
    return list.map(bu => {
        const cbu = cloneDeep(bu);
        delete cbu.contact;
        return cbu;
    });
}

function updateBlocked(state: PeopleState, list: BlockedUserInfo[], append: boolean): PeopleState {
    const blockedUsers = list.filter(bu => bu.entryId == null && bu.entryNodeName == null && bu.entryPostingId == null
        && (bu.blockedOperation === "reaction" || bu.blockedOperation === "comment"
            || bu.blockedOperation === "visibility"));
    if (blockedUsers.length === 0) {
        return state;
    }

    const istate = immutable.wrap(state);

    const blockedUser = blockedUsers[0];
    const prevBlocked = (state.contacts[blockedUser.nodeName]?.blocked ?? []).length !== 0;
    prepareContact(state, istate, blockedUser.nodeName);
    if (blockedUser.contact != null) {
        putContact(state, istate, blockedUser.nodeName, blockedUser.contact);
    }

    let nextBlocked: boolean = false;
    const ids = blockedUsers.map(bu => bu.id);
    istate.update(["contacts", blockedUser.nodeName, "blocked"],
        (bus: BlockedUserInfo[] | null) => {
            const nbus = (bus?.filter(bu => !ids.includes(bu.id)) ?? [])
                .concat(append ? cloneBlocked(blockedUsers) : []);
            nextBlocked = nbus.length !== 0;
            return nbus;
        });

    if (state.loadedGeneral) {
        istate.update("blockedTotal", total => (total ?? 0) - (prevBlocked ? 1 : 0) + (nextBlocked ? 1 : 0));
    }

    return istate.value();
}

function cloneBlockedBy(blockedByUser: BlockedByUserInfo): BlockedByUserInfo {
    const cbbu = cloneDeep(blockedByUser);
    delete cbbu.contact;
    return cbbu;
}

function updateBlockedBy(state: PeopleState, blockedByUser: BlockedByUserInfo, append: boolean): PeopleState {
    if (blockedByUser.postingId != null) {
        return state;
    }

    const istate = immutable.wrap(state);

    const prevBlockedBy = (state.contacts[blockedByUser.nodeName]?.blockedBy ?? []).length !== 0;
    prepareContact(state, istate, blockedByUser.nodeName);
    if (blockedByUser.contact != null) {
        putContact(state, istate, blockedByUser.nodeName, blockedByUser.contact);
    }

    let nextBlockedBy: boolean;
    istate.update(["contacts", blockedByUser.nodeName, "blockedBy"],
        (bbus: BlockedByUserInfo[] | null) => {
            const nbbus = (bbus?.filter(bbu => bbu.id !== blockedByUser.id) ?? [])
                .concat(append ? [cloneBlockedBy(blockedByUser)] : []);
            nextBlockedBy = nbbus.length !== 0;
            return nbbus;
        });

    if (state.loadedGeneral) {
        istate.update("blockedByTotal", total => (total ?? 0) - (prevBlockedBy ? 1 : 0) + (nextBlockedBy ? 1 : 0));
    }

    return istate.value();
}

export default (state: PeopleState = initialState, action: WithContext<ClientAction>): PeopleState => {
    switch (action.type) {
        case "INIT_FROM_LOCATION":
            return cloneDeep(initialState);

        case "PEOPLE_GO_TO_TAB":
            return immutable.set(state, "tab", action.payload.tab);

        case "PEOPLE_GENERAL_LOAD":
            return immutable.set(state, "loadingGeneral", true);

        case "PEOPLE_GENERAL_LOADED":
            return immutable.assign(state, "", {
                loadingGeneral: false,
                loadedGeneral: true,
                subscribersTotal: action.payload.info.feedSubscribersTotal ?? null,
                subscriptionsTotal: action.payload.info.feedSubscriptionsTotal ?? null,
                friendsTotal: action.payload.info.friendsTotal ?? null,
                friendOfsTotal: action.payload.info.friendOfsTotal ?? null,
                blockedTotal: action.payload.info.blockedTotal ?? null,
                blockedByTotal: action.payload.info.blockedByTotal ?? null,
                operations: action.payload.info.operations ?? {}
            });

        case "PEOPLE_GENERAL_LOAD_FAILED":
            return immutable.set(state, "loadingGeneral", false);

        case "PEOPLE_GENERAL_UNSET":
            return immutable.assign(state, "", {
                loadedGeneral: false,
                subscribersTotal: null,
                subscriptionsTotal: null,
                friendsTotal: null,
                friendOfsTotal: null,
                blockedTotal: null,
                blockedByTotal: null,
                operations: {}
            });

        case "PEOPLE_UNSET":
            return immutable.assign(state, "", {
                loadedGeneral: false,
                subscribersTotal: null,
                subscriptionsTotal: null,
                friendsTotal: null,
                friendOfsTotal: null,
                blockedTotal: null,
                blockedByTotal: null,
                loadedSubscribers: false,
                loadedSubscriptions: false,
                contacts: {},
                operations: {},
                selecting: false,
                selected: {}
            });

        case "PEOPLE_START_SELECTION":
            return immutable.set(state, "selecting", true);

        case "PEOPLE_STOP_SELECTION":
            return immutable.assign(state, "", {
                selecting: false,
                selected: {}
            });

        case "PEOPLE_SELECT_TOGGLE":
            return immutable.update(
                state,
                ["selected", action.payload.nodeName],
                (v: boolean | null | undefined) => !v
            );

        case "PEOPLE_SET_SEARCH_PREFIX":
            return immutable.set(state, "searchRegexes", nameListQueryToRegexes(action.payload.prefix));

        case "PEOPLE_SET_SORT":
            return immutable.set(state, "sortAlpha", action.payload.sortAlpha);

        case "SUBSCRIBERS_LOAD":
            return immutable.set(state, "loadingSubscribers", true);

        case "SUBSCRIBERS_LOADED": {
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

        case "SUBSCRIBERS_LOAD_FAILED":
            return immutable.set(state, "loadingSubscribers", false);

        case "SUBSCRIPTIONS_LOAD":
            return immutable.set(state, "loadingSubscriptions", true);

        case "SUBSCRIPTIONS_LOADED": {
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

        case "SUBSCRIPTIONS_LOAD_FAILED":
            return immutable.set(state, "loadingSubscriptions", false);

        case "FRIENDS_LOAD":
            return immutable.set(state, "loadingFriends", true);

        case "FRIENDS_LOADED": {
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

        case "FRIENDS_LOAD_FAILED":
            return immutable.set(state, "loadingFriends", false);

        case "FRIEND_OFS_LOAD":
            return immutable.set(state, "loadingFriendOfs", true);

        case "FRIEND_OFS_LOADED": {
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

        case "FRIEND_OFS_LOAD_FAILED":
            return immutable.set(state, "loadingFriendOfs", false);

        case "BLOCKED_LOAD":
            return immutable.set(state, "loadingBlocked", true);

        case "BLOCKED_LOADED": {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingBlocked: false,
                loadedBlocked: true,
                blockedTotal: new Set(action.payload.list.map(blocked => blocked.nodeName)).size
            });
            action.payload.list.forEach(blocked => {
                prepareContact(state, istate, blocked.nodeName);
                if (blocked.contact != null) {
                    putContact(state, istate, blocked.nodeName, blocked.contact);
                    delete blocked.contact;
                }
                istate.push(["contacts", blocked.nodeName, "blocked"], blocked);
            });
            return istate.value();
        }

        case "BLOCKED_LOAD_FAILED":
            return immutable.set(state, "loadingBlocked", false);

        case "BLOCKED_BY_LOAD":
            return immutable.set(state, "loadingBlockedBy", true);

        case "BLOCKED_BY_LOADED": {
            const istate = immutable.wrap(state);
            istate.assign("", {
                loadingBlockedBy: false,
                loadedBlockedBy: true,
                blockedByTotal: new Set(action.payload.list.map(blockedBy => blockedBy.nodeName)).size
            });
            action.payload.list.forEach(blockedBy => {
                prepareContact(state, istate, blockedBy.nodeName);
                if (blockedBy.contact != null) {
                    putContact(state, istate, blockedBy.nodeName, blockedBy.contact);
                    delete blockedBy.contact;
                }
                istate.push(["contacts", blockedBy.nodeName, "blockedBy"], blockedBy);
            });
            return istate.value();
        }

        case "BLOCKED_BY_LOAD_FAILED":
            return immutable.set(state, "loadingBlockedBy", false);

        case "FEED_SUBSCRIBED": {
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

        case "FEED_UNSUBSCRIBED": {
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

        case "FEED_SUBSCRIBER_UPDATED": {
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

        case "FEED_SUBSCRIPTION_UPDATED": {
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

        case "FRIENDSHIP_UPDATED":
            if (action.context.ownerName === action.context.homeOwnerName) {
                return updateFriendship(state, action.payload.friend);
            }
            return state;

        case "BLOCKED_USERS_ADDED":
            if (action.context.ownerName === action.context.homeOwnerName) {
                return updateBlocked(state, action.payload.blockedUsers, true);
            }
            return state;

        case "BLOCKED_USERS_DELETED":
            if (action.context.ownerName === action.context.homeOwnerName) {
                return updateBlocked(state, action.payload.blockedUsers, false);
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

        case EVENT_NODE_BLOCKED_USER_ADDED:
            if (action.context.ownerName !== action.context.homeOwnerName) { // otherwise home event handled by trigger
                return updateBlocked(state, [action.payload.blockedUser], true);
            }
            return state;

        case EVENT_NODE_BLOCKED_USER_DELETED:
            if (action.context.ownerName !== action.context.homeOwnerName) { // otherwise home event handled by trigger
                return updateBlocked(state, [action.payload.blockedUser], false);
            }
            return state;

        case EVENT_NODE_BLOCKED_BY_USER_ADDED:
            return updateBlockedBy(state, action.payload.blockedByUser, true);

        case EVENT_NODE_BLOCKED_BY_USER_DELETED:
            return updateBlockedBy(state, action.payload.blockedByUser, false);

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

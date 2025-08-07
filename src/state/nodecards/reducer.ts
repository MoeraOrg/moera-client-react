import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { BlockedByUserInfo, BlockedUserInfo, FriendGroupDetails, ProfileInfo } from "api";
import { NodeCardsState, NodeCardState } from "state/nodecards/state";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";

const emptyProfileInfo: ProfileInfo = {
    fullName: null,
    gender: null,
    email: null,
    title: null,
    bioHtml: null,
    avatar: null,
    fundraisers: [],
    operations: null
};

const emptyCard: NodeCardState = {
    details: {
        loaded: false,
        loading: false,
        profile: emptyProfileInfo
    },
    stories: {
        loaded: false,
        loading: false,
        storiesTotal: null,
        lastStoryCreatedAt: null
    },
    people: {
        loaded: false,
        loading: false,
        subscribersTotal: null,
        subscriptionsTotal: null
    },
    subscription: {
        loaded: false,
        loading: false,
        subscribing: false,
        unsubscribing: false,
        subscriber: null,
        subscription: null
    },
    friendship: {
        loaded: false,
        loading: false,
        updating: false,
        groups: null,
        remoteGroups: null
    },
    blocking: {
        loaded: false,
        loading: false,
        blocked: null,
        blockedBy: null
    },
    sheriffList: {
        loaded: false,
        loading: false,
        blocked: null
    }
};

const initialState: NodeCardsState = {
    clientName: null,
    cards: {}
};

function getCard(state: NodeCardsState, nodeName: string): {istate: WrappedObject<NodeCardsState>, card: NodeCardState} {
    const istate = immutable.wrap(state);
    let card = state.cards[nodeName];
    if (card == null) {
        card = cloneDeep(emptyCard);
        istate.set(["cards", nodeName], card);
    }
    return {istate, card};
}

function migrateCard(target: WrappedObject<NodeCardsState>, targetNodeName: string, source: NodeCardState): void {
    target.assign(["cards", targetNodeName, "details"], {
        loaded: source.details.loaded,
        profile: cloneDeep(source.details.profile)
    });
    target.assign(["cards", targetNodeName, "stories"], {
        loaded: source.stories.loaded,
        storiesTotal: source.stories.storiesTotal,
        lastStoryCreatedAt: source.stories.lastStoryCreatedAt
    });
    target.assign(["cards", targetNodeName, "people"], {
        loaded: source.people.loaded,
        subscribersTotal: source.people.subscribersTotal,
        subscriptionsTotal: source.people.subscriptionsTotal
    });
}

function updateBlocked(state: NodeCardsState, list: BlockedUserInfo[], append: boolean): NodeCardsState {
    const blockedUsers = list.filter(bu =>
        bu.entryId == null && bu.entryNodeName == null && bu.entryPostingId == null
        && (bu.blockedOperation === "reaction" || bu.blockedOperation === "comment"
            || bu.blockedOperation === "visibility"));
    if (blockedUsers.length === 0) {
        return state;
    }
    const ids = blockedUsers.map(bu => bu.id);
    const nodeName = blockedUsers[0].nodeName;
    return getCard(state, nodeName).istate
        .update(["cards", nodeName, "blocking", "blocked"],
            (bus: BlockedUserInfo[] | null) =>
                (bus?.filter(bu => !ids.includes(bu.id)) ?? []).concat(append ? blockedUsers : []))
        .value();
}

function updateBlockedBy(state: NodeCardsState, blockedByUser: BlockedByUserInfo, append: boolean): NodeCardsState {
    if (blockedByUser.postingId != null) {
        return state;
    }
    return getCard(state, blockedByUser.nodeName).istate
        .update(["cards", blockedByUser.nodeName, "blocking", "blockedBy"],
            (bbus: BlockedByUserInfo[] | null) =>
                (bbus?.filter(bbu => bbu.id === blockedByUser.id) ?? []).concat(append ? [blockedByUser] : []))
        .value();
}

export default (state: NodeCardsState = initialState, action: WithContext<ClientAction>): NodeCardsState => {
    switch (action.type) {
        case "NODE_CARD_DETAILS_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "details", "loading"], true)
                .value();
        }

        case "NODE_CARD_DETAILS_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "details", "loading"], false)
                .value();
        }

        case "NODE_CARD_DETAILS_SET": {
            const {nodeName, profile} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "details"], {
                    loading: false,
                    loaded: true,
                    profile: {
                        ...cloneDeep(emptyProfileInfo),
                        ...cloneDeep(profile)
                    }
                })
                .value();
        }

        case "OWNER_SET": {
            let {name, fullName, gender, title, avatar} = action.payload;
            const {ownerNameOrUrl} = action.context;

            name = name ?? ownerNameOrUrl;
            const istate = getCard(state, name).istate;
            const urlCard = getCard(state, ownerNameOrUrl).card;
            migrateCard(istate, name, urlCard);
            if (fullName !== false) {
                istate.set(["cards", name, "details", "profile", "fullName"], action.payload.fullName);
            }
            if (gender !== false) {
                istate.set(["cards", name, "details", "profile", "gender"], action.payload.gender);
            }
            if (title !== false) {
                istate.set(["cards", name, "details", "profile", "title"], action.payload.title);
            }
            if (avatar != null) {
                istate.set(["cards", name, "details", "profile", "avatar"], action.payload.avatar);
            }
            return istate.value();
        }

        case "CONNECTED_TO_HOME": {
            const {name, fullName, avatar} = action.payload;

            if (name == null || (fullName == null && avatar == null)) {
                return state;
            }

            const istate = getCard(state, name).istate;
            if (fullName != null) {
                istate.set(["cards", name, "details", "profile", "fullName"], fullName);
            }
            if (avatar != null) {
                istate.set(["cards", name, "details", "profile", "avatar"], avatar);
            }
            return istate.value();
        }

        case "HOME_OWNER_SET": {
            let {name, fullName, avatar} = action.payload;
            const {homeOwnerNameOrUrl} = action.context;

            name = name ?? homeOwnerNameOrUrl;
            const istate = getCard(state, name).istate;
            const urlCard = getCard(state, homeOwnerNameOrUrl).card;
            migrateCard(istate, name, urlCard);
            istate.assign(["cards", name, "details", "profile"], {
                fullName,
                avatar
            });
            return istate.value();
        }

        case "NODE_CARD_STORIES_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "stories", "loading"], true)
                .value();
        }

        case "NODE_CARD_STORIES_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "stories", "loading"], false)
                .value();
        }

        case "NODE_CARD_STORIES_SET": {
            const {nodeName, storiesTotal, lastStoryCreatedAt} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "stories"], {
                    loading: false,
                    loaded: true,
                    storiesTotal,
                    lastStoryCreatedAt
                })
                .value();
        }

        case "NODE_CARD_PEOPLE_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "people", "loading"], true)
                .value();
        }

        case "NODE_CARD_PEOPLE_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "people", "loading"], false)
                .value();
        }

        case "NODE_CARD_PEOPLE_SET": {
            const {nodeName, subscribersTotal, subscriptionsTotal} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "people"], {
                    loading: false,
                    loaded: true,
                    subscribersTotal,
                    subscriptionsTotal
                })
                .value();
        }

        case "NODE_CARD_SUBSCRIPTION_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "subscription", "loading"], true)
                .value();
        }

        case "NODE_CARD_SUBSCRIPTION_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "subscription", "loading"], false)
                .value();
        }

        case "NODE_CARD_SUBSCRIPTION_SET": {
            const {nodeName, subscriber, subscription} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "subscription"], {
                    loading: false,
                    loaded: true,
                    subscriber,
                    subscription
                })
                .value();
        }

        case "NODE_CARD_FRIENDSHIP_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "friendship", "loading"], true)
                .value();
        }

        case "NODE_CARD_FRIENDSHIP_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "friendship", "loading"], false)
                .value();
        }

        case "NODE_CARD_FRIENDSHIP_SET": {
            const {nodeName, groups, remoteGroups} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "friendship"], {
                    loading: false,
                    loaded: true,
                    groups,
                    remoteGroups
                })
                .value();
        }

        case "NODE_CARD_BLOCKING_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "blocking", "loading"], true)
                .value();
        }

        case "NODE_CARD_BLOCKING_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "blocking", "loading"], false)
                .value();
        }

        case "NODE_CARD_BLOCKING_SET": {
            const {nodeName, blocked, blockedBy} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "blocking"], {
                    loading: false,
                    loaded: true,
                    blocked,
                    blockedBy
                })
                .value();
        }

        case "NODE_CARDS_PREFILL": {
            const {contacts} = action.payload;
            const istate = immutable.wrap(state);
            for (const contact of contacts) {
                const nodeName = contact.contact.nodeName;
                let card = state.cards[nodeName];
                if (card == null) {
                    card = cloneDeep(emptyCard);
                    istate.set(["cards", nodeName], card);
                }
                if (!card.subscription.loading && !card.subscription.loaded) {
                    istate.assign(["cards", nodeName, "subscription"], {
                        loading: false,
                        loaded: true,
                        subscriber: contact.subscriber,
                        subscription: contact.subscription
                    });
                }
                if (!card.friendship.loading && !card.friendship.loaded) {
                    istate.assign(["cards", nodeName, "friendship"], {
                        loading: false,
                        loaded: true,
                        groups: contact.friend?.groups ?? null,
                        remoteGroups: contact.friendOf?.groups ?? null
                    });
                }
                if (!card.blocking.loading && !card.blocking.loaded) {
                    istate.assign(["cards", nodeName, "blocking"], {
                        loading: false,
                        loaded: true,
                        blocked: contact.blocked ?? null,
                        blockedBy: contact.blockedBy ?? null
                    });
                }
            }
            return istate.value();
        }

        case "NODE_CARD_SHERIFF_LIST_LOAD": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "sheriffList", "loading"], true)
                .value();
        }

        case "NODE_CARD_SHERIFF_LIST_LOAD_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "sheriffList", "loading"], false)
                .value();
        }

        case "NODE_CARD_SHERIFF_LIST_SET": {
            const {nodeName, blocked} = action.payload;
            return getCard(state, nodeName).istate
                .assign(["cards", nodeName, "sheriffList"], {
                    loading: false,
                    loaded: true,
                    blocked
                })
                .value();
        }

        case "FEED_SUBSCRIBE": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "subscription", "subscribing"], true)
                .value();
        }

        case "FEED_SUBSCRIBED": {
            const {nodeName, subscription} = action.payload;
            const {ownerName} = action.context;
            const istate = getCard(state, nodeName).istate;
            istate.assign(["cards", nodeName, "subscription"], {
                subscribing: false,
                subscription
            });
            if (nodeName !== ownerName) {
                istate.update(["cards", nodeName, "people.subscribersTotal"], total => total + 1);
            }
            return istate.value();
        }

        case "FEED_SUBSCRIBE_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "subscription", "subscribing"], false)
                .value();
        }

        case "FEED_UNSUBSCRIBE": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "subscription", "unsubscribing"], false)
                .value();
        }

        case "FEED_UNSUBSCRIBED": {
            const {nodeName} = action.payload;
            const {ownerName} = action.context;
            const istate = getCard(state, nodeName).istate;
            istate.assign(["cards", nodeName, "subscription"], {
                unsubscribing: false,
                subscription: null
            });
            if (nodeName !== ownerName) {
                istate.update(["cards", nodeName, "people.subscribersTotal"], total => total > 0 ? total - 1 : 0);
            }
            return istate.value();
        }

        case "FEED_UNSUBSCRIBE_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "subscription", "unsubscribing"], false)
                .value();
        }

        case "FEED_SUBSCRIBER_UPDATED": {
            const {nodeName, subscriber} = action.payload;
            const {homeOwnerName} = action.context;
            const istate = getCard(state, subscriber.nodeName).istate;
            if (nodeName === homeOwnerName) {
                istate.set(["cards", subscriber.nodeName, "subscription", "subscriber"], subscriber);
            }
            return istate.value();
        }

        case "FEED_SUBSCRIPTION_UPDATED": {
            const {nodeName, subscription} = action.payload;
            const {homeOwnerName} = action.context;
            const istate = getCard(state, subscription.remoteNodeName).istate;
            if (nodeName === homeOwnerName) {
                istate.set(["cards", subscription.remoteNodeName, "subscription", "subscription"], subscription);
            }
            return istate.value();
        }

        case "FRIENDSHIP_UPDATE": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "friendship", "updating"], true)
                .value();
        }

        case "FRIENDSHIP_UPDATED": {
            const {friend: {nodeName, groups}} = action.payload;
            const istate = getCard(state, nodeName).istate;
            istate.assign(["cards", nodeName, "friendship"], {
                updating: false,
                groups
            });
            return istate.value();
        }

        case "FRIENDSHIP_UPDATE_FAILED": {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set(["cards", nodeName, "friendship", "updating"], false)
                .value();
        }

        case "BLOCKED_USERS_ADDED":
            return updateBlocked(state, action.payload.blockedUsers, true);

        case "BLOCKED_USERS_DELETED":
            return updateBlocked(state, action.payload.blockedUsers, false);

        case "NODE_CARDS_CLIENT_SWITCH": {
            const {homeOwnerNameOrUrl} = action.context;
            if (state.clientName === homeOwnerNameOrUrl) {
                return state;
            }
            const istate = immutable.wrap(state);
            istate.set("clientName", homeOwnerNameOrUrl);
            for (const nodeName of Object.keys(state.cards)) {
                istate.set(["cards", nodeName, "details", "loaded"], false);
                istate.assign(["cards", nodeName], {
                    people: cloneDeep(emptyCard.people),
                    subscription: cloneDeep(emptyCard.subscription),
                    friendship: cloneDeep(emptyCard.friendship),
                    blocking: cloneDeep(emptyCard.blocking)
                });
            }
            return istate.value();
        }

        case "NODE_CARDS_REFRESH": {
            const istate = immutable.wrap(state);
            for (const nodeName of Object.keys(state.cards)) {
                istate.assign(["cards", nodeName], { // Other parts are refreshed by events
                    stories: cloneDeep(emptyCard.stories),
                    people: cloneDeep(emptyCard.people)
                });
            }
            return istate.value();
        }

        case "EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED": {
            const {name, fullName} = action.payload;
            return getCard(state, name).istate
                .set(["cards", name, "details", "profile", "fullName"], fullName)
                .value();
        }

        case "EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED": {
            const {name, avatar} = action.payload;
            return getCard(state, name).istate
                .set(["cards", name, "details", "profile", "avatar"], cloneDeep(avatar))
                .value();
        }

        case "EVENT_NODE_SUBSCRIBERS_TOTAL_CHANGED": {
            const {feedSubscribersTotal} = action.payload;
            const {ownerName} = action.context;
            if (ownerName != null) {
                return getCard(state, ownerName).istate
                    .set(["cards", ownerName, "people", "subscribersTotal"], feedSubscribersTotal)
                    .value();
            }
            return state;
        }

        case "EVENT_NODE_SUBSCRIPTIONS_TOTAL_CHANGED": {
            const {feedSubscriptionsTotal} = action.payload;
            const {ownerName} = action.context;
            if (ownerName != null) {
                return getCard(state, ownerName).istate
                    .set(["cards", ownerName, "people", "subscriptionsTotal"], feedSubscriptionsTotal)
                    .value();
            }
            return state;
        }

        case "EVENT_HOME_SUBSCRIBERS_TOTAL_CHANGED": {
            const {feedSubscribersTotal} = action.payload;
            const {homeOwnerName} = action.context;
            if (homeOwnerName != null) {
                return getCard(state, homeOwnerName).istate
                    .set(["cards", homeOwnerName, "people", "subscribersTotal"], feedSubscribersTotal)
                    .value();
            }
            return state;
        }

        case "EVENT_HOME_SUBSCRIPTIONS_TOTAL_CHANGED": {
            const {feedSubscriptionsTotal} = action.payload;
            const {homeOwnerName} = action.context;
            if (homeOwnerName != null) {
                return getCard(state, homeOwnerName).istate
                    .set(["cards", homeOwnerName, "people", "subscriptionsTotal"], feedSubscriptionsTotal)
                    .value();
            }
            return state;
        }

        case "EVENT_HOME_SUBSCRIBER_ADDED": {
            const {subscriber} = action.payload;
            return getCard(state, subscriber.nodeName).istate
                .set(["cards", subscriber.nodeName, "subscription", "subscriber"], subscriber)
                .value();
        }

        case "EVENT_HOME_SUBSCRIBER_DELETED": {
            const {subscriber} = action.payload;
            const {istate, card} = getCard(state, subscriber.nodeName);
            if (card.subscription.subscriber?.id === subscriber.id) {
                return istate
                    .set(["cards", subscriber.nodeName, "subscription", "subscriber"], null)
                    .value();
            }
            return state;
        }

        case "EVENT_HOME_SUBSCRIPTION_ADDED": {
            const {subscription} = action.payload;
            if (subscription.type !== "feed") {
                return state;
            }
            return getCard(state, subscription.remoteNodeName).istate
                .assign(["cards", subscription.remoteNodeName, "subscription"], {
                    subscribing: false,
                    subscription
                })
                .value();
        }

        case "EVENT_HOME_SUBSCRIPTION_DELETED": {
            const {subscription} = action.payload;
            if (subscription.type !== "feed") {
                return state;
            }
            return getCard(state, subscription.remoteNodeName).istate
                .assign(["cards", subscription.remoteNodeName, "subscription"], {
                    unsubscribing: false,
                    subscription: null
                })
                .value();
        }

        case "EVENT_HOME_FRIEND_GROUP_DELETED": {
            const istate = immutable.wrap(state);
            for (let nodeName of Object.keys(state.cards)) {
                if (state.cards[nodeName]?.friendship.groups != null) {
                    istate.update(["cards", nodeName, "friendship", "groups"],
                        (groups: FriendGroupDetails[]) => groups.filter(fg => fg.id !== action.payload.friendGroupId));
                }
            }
            return istate.value();
        }

        case "EVENT_HOME_FRIENDSHIP_UPDATED": {
            const {friend: {nodeName, groups}} = action.payload;
            const {istate, card} = getCard(state, nodeName);
            if (card.friendship.loaded) {
                istate.set(["cards", nodeName, "friendship", "groups"], groups);
                return istate.value();
            }
            return state;
        }

        case "EVENT_HOME_BLOCKED_BY_USER_ADDED":
            return updateBlockedBy(state, action.payload.blockedByUser, true);

        case "EVENT_HOME_BLOCKED_BY_USER_DELETED":
            return updateBlockedBy(state, action.payload.blockedByUser, false);

        default:
            return state;
    }
}

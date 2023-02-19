import { call, put, select } from 'typed-redux-saga';

import { NodeApiError } from "api";
import { Node } from "api/node";
import { FriendDescription, FriendGroupInfo, PrincipalValue, RemoteFeed, SubscriptionInfo } from "api/node/api-types";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    BLOCKED_BY_LOAD,
    BLOCKED_LOAD,
    blockedByLoaded,
    blockedByLoadFailed,
    blockedLoaded,
    blockedLoadFailed,
    FRIEND_OFS_LOAD,
    friendGroupAdded,
    friendOfsLoaded,
    friendOfsLoadFailed,
    FRIENDS_LOAD,
    FRIENDSHIP_SET_VISIBILITY,
    FRIENDSHIP_UPDATE,
    FriendshipSetVisibilityAction,
    FriendshipUpdateAction,
    friendshipUpdated,
    friendshipUpdateFailed,
    friendsLoaded,
    friendsLoadFailed,
    PEOPLE_GENERAL_LOAD,
    PEOPLE_GO_TO_DEFAULT_TAB,
    PEOPLE_SELECTED_ASK,
    PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS,
    PEOPLE_SELECTED_FRIEND,
    PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY,
    PEOPLE_SELECTED_SUBSCRIBE,
    PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY,
    PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY,
    PEOPLE_SELECTED_UNFRIEND,
    PEOPLE_SELECTED_UNSUBSCRIBE,
    peopleGeneralLoaded,
    peopleGeneralLoadFailed,
    peopleGoToTab,
    PeopleSelectedAskAction,
    PeopleSelectedChangeFriendGroupsAction,
    PeopleSelectedFriendshipSetVisibilityAction,
    PeopleSelectedSubscriberSetVisibilityAction,
    PeopleSelectedSubscriptionSetVisibilityAction,
    SUBSCRIBERS_LOAD,
    subscribersLoaded,
    subscribersLoadFailed,
    SUBSCRIPTIONS_LOAD,
    subscriptionsLoaded,
    subscriptionsLoadFailed
} from "state/people/actions";
import { executor } from "state/executor";
import { introduced } from "state/init-selectors";
import { getHomeFriendsId } from "state/home/selectors";
import { getNodeFriendGroups, isPrincipalIn } from "state/node/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { storySatisfy } from "state/stories/actions";
import {
    getPeopleSelectedContacts,
    getPeopleTab,
    isBlockedByVisible,
    isBlockedVisible,
    isFriendOfsTotalVisible,
    isFriendOfsVisible,
    isFriendsTotalVisible,
    isFriendsVisible,
    isSubscribersTotalVisible,
    isSubscribersVisible,
    isSubscriptionsTotalVisible,
    isSubscriptionsVisible
} from "state/people/selectors";
import { feedSubscribed, feedUnsubscribed } from "state/feeds/actions";
import { nodeFeedSubscriberSetVisibility, nodeFeedSubscriptionSetVisibility } from "state/feeds/sagas";
import { closeProgressBox, openProgressBox, updateProgressBox } from "state/progressbox/actions";
import { PeopleTab } from "state/people/state";

export default [
    executor(PEOPLE_GO_TO_DEFAULT_TAB, "", peopleGoToDefaultTabSaga),
    executor(PEOPLE_GENERAL_LOAD, "", peopleGeneralLoadSaga, introduced),
    executor(SUBSCRIBERS_LOAD, "", subscribersLoadSaga, introduced),
    executor(SUBSCRIPTIONS_LOAD, "", subscriptionsLoadSaga, introduced),
    executor(FRIENDS_LOAD, "", friendsLoadSaga, introduced),
    executor(FRIEND_OFS_LOAD, "", friendOfsLoadSaga, introduced),
    executor(BLOCKED_LOAD, "", blockedLoadSaga, introduced),
    executor(BLOCKED_BY_LOAD, "", blockedByLoadSaga, introduced),
    executor(FRIENDSHIP_UPDATE, payload => payload.nodeName, friendshipUpdateSaga),
    executor(FRIENDSHIP_SET_VISIBILITY, payload => payload.nodeName, friendshipSetVisibilitySaga),
    executor(PEOPLE_SELECTED_SUBSCRIBE, "", peopleSelectedSubscribeSaga),
    executor(PEOPLE_SELECTED_UNSUBSCRIBE, "", peopleSelectedUnsubscribeSaga),
    executor(PEOPLE_SELECTED_FRIEND, "", peopleSelectedFriendSaga),
    executor(PEOPLE_SELECTED_UNFRIEND, "", peopleSelectedUnfriendSaga),
    executor(PEOPLE_SELECTED_ASK, "", peopleSelectedAskSaga),
    executor(PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY, "", peopleSelectedSubscriberSetVisibilitySaga),
    executor(PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY, "", peopleSelectedSubscriptionSetVisibilitySaga),
    executor(PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY, "", peopleSelectedFriendshipSetVisibilitySaga),
    executor(PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS, "", peopleSelectedChangeFriendGroupsSaga)
];

function* peopleGoToDefaultTabSaga() {
    const {loaded, tab, friendGroups, ...visible} = yield* select(state => ({
        loaded: state.people.loadedGeneral,
        tab: getPeopleTab(state),
        subscribers: isSubscribersVisible(state) || isSubscribersTotalVisible(state),
        subscriptions: isSubscriptionsVisible(state) || isSubscriptionsTotalVisible(state),
        friends: isFriendsVisible(state) || isFriendsTotalVisible(state),
        friendOfs: isFriendOfsVisible(state) || isFriendOfsTotalVisible(state),
        blocked: isBlockedVisible(state),
        blockedBy: isBlockedByVisible(state),
        friendGroups: getNodeFriendGroups(state),
        friendGroupTab: getNodeFriendGroups(state).map(fg => fg.id).includes(getPeopleTab(state))
    }));

    if (!loaded) {
        return;
    }

    switch (tab) {
        case "subscribers":
            if (visible.subscribers) {
                return;
            }
            break;
        case "subscriptions":
            if (visible.subscriptions) {
                return;
            }
            break;
        case "friend-ofs":
            if (visible.friendOfs) {
                return;
            }
            break;
        case "blocked":
            if (visible.blocked) {
                return;
            }
            break;
        case "blocked-by":
            if (visible.blockedBy) {
                return;
            }
            break;
        default:
            if (visible.friends && visible.friendGroupTab) {
                return;
            }
    }

    let targetTab: PeopleTab;
    if (visible.subscribers) {
        targetTab = "subscribers";
    } else if (visible.subscriptions) {
        targetTab = "subscriptions"
    } else if (visible.friends && friendGroups.length > 0) {
        targetTab = friendGroups[0].id;
    } else if (visible.friendOfs) {
        targetTab = "friend-ofs";
    } else if (visible.blocked) {
        targetTab = "blocked";
    } else if (visible.blockedBy) {
        targetTab = "blocked-by";
    } else {
        return;
    }
    yield* put(peopleGoToTab(targetTab));
}

function* peopleGeneralLoadSaga() {
    try {
        const data = yield* call(Node.getPeopleGeneral, "");
        yield* put(peopleGeneralLoaded(data));
    } catch (e) {
        yield* put(peopleGeneralLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* subscribersLoadSaga() {
    try {
        const subscribers = yield* call(Node.getSubscribers, "", "feed" as const);
        yield* put(subscribersLoaded(subscribers));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(subscribersLoaded([]));
        } else {
            yield* put(subscribersLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function* subscriptionsLoadSaga() {
    try {
        const subscriptions = yield* call(Node.getSubscriptions, "", "feed" as const);
        yield* put(subscriptionsLoaded(subscriptions));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(subscriptionsLoaded([]));
        } else {
            yield* put(subscriptionsLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function* friendsLoadSaga() {
    try {
        const friends = yield* call(Node.getFriends, "");
        yield* put(friendsLoaded(friends));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(friendsLoaded([]));
        } else {
            yield* put(friendsLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function* friendOfsLoadSaga() {
    try {
        const friendOfs = yield* call(Node.getFriendOfs, "");
        yield* put(friendOfsLoaded(friendOfs));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(friendOfsLoaded([]));
        } else {
            yield* put(friendOfsLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function* blockedLoadSaga() {
    try {
        const blocked = yield* call(Node.searchBlockedUsers, "",
            {blockedOperations: ["comment" as const, "reaction" as const]});
        yield* put(blockedLoaded(blocked));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(blockedLoaded([]));
        } else {
            yield* put(blockedLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function* blockedByLoadSaga() {
    try {
        const blockedBy = yield* call(Node.searchBlockedByUsers, "", {strict: true});
        yield* put(blockedByLoaded(blockedBy));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(blockedByLoaded([]));
        } else {
            yield* put(blockedByLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function* friendshipUpdateSaga(action: FriendshipUpdateAction) {
    const {nodeName, friendGroups, storyId} = action.payload;

    try {
        const friends = yield* call(Node.putFriends, ":", [{nodeName, groups: friendGroups?.map(id => ({id})) ?? null}]);
        if (friends.length > 0) {
            yield* put(friendshipUpdated(friends[0]));
        }
        if (storyId != null) {
            yield* put(storySatisfy(":instant", storyId));
        }
    } catch (e) {
        yield* put(friendshipUpdateFailed(nodeName));
        yield* put(errorThrown(e));
    }
}

function* friendshipSetVisibilitySaga(action: FriendshipSetVisibilityAction) {
    const {nodeName, visible} = action.payload;

    const view: PrincipalValue = visible ? "public" : "private";
    const nodeCard = yield* select(state => getNodeCard(state, nodeName));

    if (nodeCard == null || !nodeCard.friendship.loaded) {
        return;
    }

    try {
        const friends = yield* call(Node.putFriends, ":", [{
            nodeName, groups: nodeCard.friendship.groups?.map(({id}) => ({id, operations: {view}})) ?? null}]);
        if (friends.length > 0) {
            yield* put(friendshipUpdated(friends[0]));
        }
    } catch (e) {
        yield* put(friendshipUpdateFailed(nodeName));
        yield* put(errorThrown(e));
    }
}

function* peopleSelectedSubscribeSaga() {
    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => !c.hasFeedSubscription);
    yield* put(openProgressBox(0, contacts.length));
    let done = 0;
    for (const contact of contacts) {
        try {
            const subscription = yield* call(Node.postFeedSubscription, ":", contact.nodeName, "timeline");
            yield* put(feedSubscribed(contact.nodeName, subscription));
            yield* put(updateProgressBox(++done, contacts.length));
        } catch (e) {
            yield* put(errorThrown(e));
        }
    }
    yield* put(closeProgressBox());
}

function* peopleSelectedUnsubscribeSaga() {
    const contacts = yield* select(getPeopleSelectedContacts);
    const remoteFeeds: RemoteFeed[] = contacts
        .filter(c => c.hasFeedSubscription)
        .map(c => ({nodeName: c.nodeName, feedName: "timeline"}));
    yield* put(openProgressBox());
    let subscriptions: SubscriptionInfo[] = [];
    try {
        subscriptions = (yield* call(Node.searchSubscriptions, ":", "feed", remoteFeeds, null))
            .filter(sr => isPrincipalIn("delete", sr, "admin", "admin"));
    } catch (e) {
        yield* put(errorThrown(e));
        yield* put(closeProgressBox());
        return;
    }
    yield* put(updateProgressBox(0, subscriptions.length));
    let done = 0;
    for (const subscription of subscriptions) {
        try {
            const contact = yield* call(Node.deleteSubscription, ":", subscription.id);
            yield* put(feedUnsubscribed(subscription.remoteNodeName, "timeline", contact));
            yield* put(updateProgressBox(++done, subscriptions.length));
        } catch (e) {
            yield* put(errorThrown(e));
        }
    }
    yield* put(closeProgressBox());
}

function* updateSelectedFriendship(friendDescriptions: FriendDescription[]) {
    try {
        yield* put(openProgressBox(0, friendDescriptions.length));
        const friends = yield* call(Node.putFriends, ":", friendDescriptions);
        let done = 0;
        for (const friend of friends) {
            yield* put(friendshipUpdated(friend));
            yield* put(updateProgressBox(++done, friends.length));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox());
}

function* peopleSelectedFriendSaga() {
    const friendsId = (yield* select(getHomeFriendsId));
    if (friendsId == null) {
        return;
    }
    const friendDescriptions: FriendDescription[] = (yield* select(getPeopleSelectedContacts))
        .filter(c => !c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: [{id: friendsId}]}));
    yield* call(updateSelectedFriendship, friendDescriptions);
}

function* peopleSelectedUnfriendSaga() {
    const friendDescriptions: FriendDescription[] = (yield* select(getPeopleSelectedContacts))
        .filter(c => c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: []}));
    yield* call(updateSelectedFriendship, friendDescriptions);
}

function* peopleSelectedAskSaga(action: PeopleSelectedAskAction) {
    const {subject, message} = action.payload;

    let contacts = yield* select(getPeopleSelectedContacts);
    switch (subject) {
        case "subscribe":
            contacts = contacts.filter(c => !c.hasFeedSubscriber);
            break;
        case "friend":
            contacts = contacts.filter(c => !c.hasFriend);
            break;
    }
    if (contacts.length === 0) {
        return;
    }
    yield* put(openProgressBox(0, contacts.length));
    try {
        let done = 0;
        for (const contact of contacts) {
            const features = yield* call(Node.getFeatures, contact.nodeName);
            if (features.ask != null && features.ask.includes(subject)) {
                let friendsId = null;
                if (subject === "friend") {
                    friendsId = features.friendGroups?.available.find(fg => fg.title === "t:friends")?.id ?? null;
                }
                if (subject === "subscribe" || friendsId != null) {
                    yield* call(Node.askRemoteNode, ":", contact.nodeName, subject, friendsId, message);
                }
            }
            yield* put(updateProgressBox(++done, contacts.length));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox());
}

function* peopleSelectedSubscriberSetVisibilitySaga(action: WithContext<PeopleSelectedSubscriberSetVisibilityAction>) {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => c.hasFeedSubscriber);
    if (contacts.length === 0) {
        return;
    }
    yield* put(openProgressBox(0, contacts.length));
    try {
        let done = 0;
        for (const contact of contacts) {
            let subscriber = (yield* call(Node.getSubscribers, ":", "feed" as const, contact.nodeName))?.[0];
            if (subscriber != null) {
                yield* call(nodeFeedSubscriberSetVisibility, subscriber.id, visible, homeOwnerName);
            }
            yield* put(updateProgressBox(++done, contacts.length));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox());
}

function* peopleSelectedSubscriptionSetVisibilitySaga(action: WithContext<PeopleSelectedSubscriptionSetVisibilityAction>) {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => c.hasFeedSubscription);
    if (contacts.length === 0) {
        return;
    }
    yield* put(openProgressBox(0, contacts.length));
    try {
        let done = 0;
        for (const contact of contacts) {
            let subscription = (yield* call(Node.getSubscriptions, ":", "feed" as const, contact.nodeName))?.[0];
            if (subscription != null) {
                yield* call(nodeFeedSubscriptionSetVisibility, subscription.id, visible, homeOwnerName);
            }
            yield* put(updateProgressBox(++done, contacts.length));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox());
}

function* peopleSelectedFriendshipSetVisibilitySaga(action: WithContext<PeopleSelectedFriendshipSetVisibilityAction>) {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => c.hasFriend);
    if (contacts.length === 0) {
        return;
    }
    yield* put(openProgressBox(0, contacts.length));
    const view: PrincipalValue = visible ? "public" : "private";
    try {
        let done = 0;
        for (const contact of contacts) {
            const {groups} = yield* call(Node.getFriend, ":", contact.nodeName);
            const friends = yield* call(Node.putFriends, ":", [{
                nodeName: contact.nodeName, groups: groups?.map(({id}) => ({id, operations: {view}})) ?? null}]);
            if (friends.length > 0) {
                yield* put(friendshipUpdated(friends[0]));
            }
            yield* put(updateProgressBox(++done, contacts.length));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox());
}

function* peopleSelectedChangeFriendGroupsSaga(action: WithContext<PeopleSelectedChangeFriendGroupsAction>) {
    const {includedGroups, excludedGroups, addedGroups, addedGroupTitles, addedGroupView} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => c.hasFriend);
    if (contacts.length === 0) {
        return;
    }

    const progressTotal = addedGroupTitles.length + contacts.length;
    yield* put(openProgressBox(0, progressTotal));
    const added: FriendGroupInfo[] = [];
    try {
        for (let i = 0; i < addedGroupTitles.length; i++) {
            if (!addedGroupTitles[i]) {
                yield* put(updateProgressBox(i + 1, progressTotal));
                continue;
            }
            const group = yield* call(Node.postFriendGroup, ":", addedGroupTitles[i], addedGroupView[i]);
            added.push(group);
            if (addedGroups.includes(i)) {
                includedGroups.push(group.id);
            }
            yield* put(updateProgressBox(i + 1, progressTotal));
        }
        let done = 0;
        for (const contact of contacts) {
            const {groups} = yield* call(Node.getFriend, ":", contact.nodeName);
            if (groups != null && groups.length > 0) {
                const newGroups = groups
                    .filter(gr => !excludedGroups.includes(gr.id))
                    .map(({id, operations}) => ({id, operations}));
                const view: PrincipalValue = groups[0].operations?.view ?? "public";
                includedGroups.forEach(id => newGroups.push({id, operations: {view}}));
                const friends = yield* call(Node.putFriends, ":", [{nodeName: contact.nodeName, groups: newGroups}]);
                if (friends.length > 0) {
                    yield* put(friendshipUpdated(friends[0]));
                }
            }
            yield* put(updateProgressBox(addedGroupTitles.length + (++done), progressTotal));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox());
    for (const group of added) {
        yield* put(friendGroupAdded(homeOwnerName, group));
    }
}

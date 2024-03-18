import { call, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import {
    CLIENT_SETTINGS_PREFIX,
    FriendDescription,
    FriendGroupInfo,
    Node,
    NodeApiError,
    PrincipalValue,
    RemoteFeed,
    SubscriptionInfo
} from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    BlockedByLoadAction,
    blockedByLoaded,
    blockedByLoadFailed,
    BlockedLoadAction,
    blockedLoaded,
    blockedLoadFailed,
    friendGroupAdded,
    FriendOfsLoadAction,
    friendOfsLoaded,
    friendOfsLoadFailed,
    FriendshipSetVisibilityAction,
    FriendshipUpdateAction,
    friendshipUpdated,
    friendshipUpdateFailed,
    FriendsLoadAction,
    friendsLoaded,
    friendsLoadFailed,
    PeopleGeneralLoadAction,
    peopleGeneralLoaded,
    peopleGeneralLoadFailed,
    PeopleGoToDefaultTabAction,
    peopleGoToTab,
    PeopleSelectedAskAction,
    PeopleSelectedChangeFriendGroupsAction,
    PeopleSelectedFriendAction,
    PeopleSelectedFriendshipSetVisibilityAction,
    PeopleSelectedSubscribeAction,
    PeopleSelectedSubscriberSetVisibilityAction,
    PeopleSelectedSubscriptionSetVisibilityAction,
    PeopleSelectedUnfriendAction,
    PeopleSelectedUnsubscribeAction,
    SubscribersLoadAction,
    subscribersLoaded,
    subscribersLoadFailed,
    SubscriptionsLoadAction,
    subscriptionsLoaded,
    subscriptionsLoadFailed
} from "state/people/actions";
import { executor } from "state/executor";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { homeIntroduced } from "state/init-selectors";
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
import { feedSubscribe, feedSubscribed, feedUnsubscribed } from "state/feeds/actions";
import { nodeFeedSubscriberSetVisibility, nodeFeedSubscriptionSetVisibility } from "state/feeds/sagas";
import { closeProgressBox, openProgressBox, updateProgressBox } from "state/progressbox/actions";
import { PeopleTab } from "state/people/state";
import { confirmBox } from "state/confirmbox/actions";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

export default [
    executor("PEOPLE_GO_TO_DEFAULT_TAB", "", peopleGoToDefaultTabSaga),
    executor("PEOPLE_GENERAL_LOAD", "", peopleGeneralLoadSaga, homeIntroduced),
    executor("SUBSCRIBERS_LOAD", "", subscribersLoadSaga, homeIntroduced),
    executor("SUBSCRIPTIONS_LOAD", "", subscriptionsLoadSaga, homeIntroduced),
    executor("FRIENDS_LOAD", "", friendsLoadSaga, homeIntroduced),
    executor("FRIEND_OFS_LOAD", "", friendOfsLoadSaga, homeIntroduced),
    executor("BLOCKED_LOAD", "", blockedLoadSaga, homeIntroduced),
    executor("BLOCKED_BY_LOAD", "", blockedByLoadSaga, homeIntroduced),
    executor("FRIENDSHIP_UPDATE", payload => payload.nodeName, friendshipUpdateSaga),
    executor("FRIENDSHIP_SET_VISIBILITY", payload => payload.nodeName, friendshipSetVisibilitySaga),
    executor("PEOPLE_SELECTED_SUBSCRIBE", "", peopleSelectedSubscribeSaga),
    executor("PEOPLE_SELECTED_UNSUBSCRIBE", "", peopleSelectedUnsubscribeSaga),
    executor("PEOPLE_SELECTED_FRIEND", "", peopleSelectedFriendSaga),
    executor("PEOPLE_SELECTED_UNFRIEND", "", peopleSelectedUnfriendSaga),
    executor("PEOPLE_SELECTED_ASK", "", peopleSelectedAskSaga),
    executor("PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY", "", peopleSelectedSubscriberSetVisibilitySaga),
    executor("PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY", "", peopleSelectedSubscriptionSetVisibilitySaga),
    executor("PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY", "", peopleSelectedFriendshipSetVisibilitySaga),
    executor("PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS", "", peopleSelectedChangeFriendGroupsSaga)
];

function* peopleGoToDefaultTabSaga(action: PeopleGoToDefaultTabAction) {
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
    yield* put(peopleGoToTab(targetTab).causedBy(action));
}

function* peopleGeneralLoadSaga(action: WithContext<PeopleGeneralLoadAction>) {
    try {
        const info = yield* call(Node.getPeopleGeneral, action, REL_CURRENT);
        yield* put(peopleGeneralLoaded(info).causedBy(action));
    } catch (e) {
        yield* put(peopleGeneralLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* subscribersLoadSaga(action: WithContext<SubscribersLoadAction>) {
    try {
        const subscribers = yield* call(Node.getSubscribers, action, REL_CURRENT, null, "feed" as const, null, null,
            ["authentication.required"]);
        yield* put(subscribersLoaded(subscribers).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(subscribersLoaded([]).causedBy(action));
        } else {
            yield* put(subscribersLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* subscriptionsLoadSaga(action: WithContext<SubscriptionsLoadAction>) {
    try {
        const subscriptions = yield* call(Node.getSubscriptions, action, REL_CURRENT, null, "feed" as const,
            ["authentication.required"]);
        yield* put(subscriptionsLoaded(subscriptions).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(subscriptionsLoaded([]).causedBy(action));
        } else {
            yield* put(subscriptionsLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* friendsLoadSaga(action: WithContext<FriendsLoadAction>) {
    try {
        const friends = yield* call(Node.getFriends, action, REL_CURRENT);
        yield* put(friendsLoaded(friends).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(friendsLoaded([]).causedBy(action));
        } else {
            yield* put(friendsLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* friendOfsLoadSaga(action: WithContext<FriendOfsLoadAction>) {
    try {
        const friendOfs = yield* call(Node.getFriendOfs, action, REL_CURRENT);
        yield* put(friendOfsLoaded(friendOfs).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(friendOfsLoaded([]).causedBy(action));
        } else {
            yield* put(friendOfsLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* blockedLoadSaga(action: WithContext<BlockedLoadAction>) {
    try {
        const blocked = yield* call(Node.searchBlockedUsers, action, REL_CURRENT,
            {blockedOperations: ["comment" as const, "reaction" as const, "visibility" as const]});
        yield* put(blockedLoaded(blocked).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(blockedLoaded([]).causedBy(action));
        } else {
            yield* put(blockedLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* blockedByLoadSaga(action: WithContext<BlockedByLoadAction>) {
    try {
        const blockedBy = yield* call(Node.searchBlockedByUsers, action, REL_CURRENT, {strict: true});
        yield* put(blockedByLoaded(blockedBy).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(blockedByLoaded([]).causedBy(action));
        } else {
            yield* put(blockedByLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* friendshipUpdateSaga(action: WithContext<FriendshipUpdateAction>) {
    const {nodeName, friendGroups, storyId} = action.payload;

    try {
        const friends = yield* call(Node.updateFriends, action, REL_HOME,
            [{nodeName, groups: friendGroups?.map(id => ({id})) ?? null}]);
        if (friends.length > 0) {
            yield* put(friendshipUpdated(friends[0]).causedBy(action));
        }
        if (storyId != null) {
            yield* put(storySatisfy(":instant", storyId).causedBy(action));
        }
        if (friendGroups != null && friendGroups.length > 0) {
            yield* call(subscribeToFriend, action, nodeName);
        }
    } catch (e) {
        yield* put(friendshipUpdateFailed(nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* subscribeToFriend(action: WithContext<FriendshipUpdateAction>, nodeName: string) {
    const subscriptions = yield* call(Node.getSubscriptions, action, REL_HOME, nodeName, "feed" as const,
        ["authentication.required"]);
    if (subscriptions.length > 0) {
        return;
    }

    const add = yield* select((state: ClientState) => getSetting(state, "friends.subscribe-on-add") as string);

    if (add === "ask") {
        const onYes = (dontShowAgain: boolean): ClientAction[] => {
            const actions: ClientAction[] = [];
            actions.push(feedSubscribe(nodeName, "timeline"));
            if (dontShowAgain) {
                actions.push(settingsUpdate([{
                    name: CLIENT_SETTINGS_PREFIX + "friends.subscribe-on-add",
                    value: "yes"
                }]));
            }
            return actions;
        }

        const onNo = (dontShowAgain: boolean): ClientAction | void => {
            if (dontShowAgain) {
                return settingsUpdate([{
                    name: CLIENT_SETTINGS_PREFIX + "friends.subscribe-on-add",
                    value: "no"
                }]);
            }
        }

        yield* put(confirmBox(
            i18n.t("not-subscribed-friend"), null, null, onYes, onNo, "primary", null, null, true
        ).causedBy(action));
    } else if (add === "yes") {
        yield* put(feedSubscribe(nodeName, "timeline").causedBy(action));
    }
}

function* friendshipSetVisibilitySaga(action: WithContext<FriendshipSetVisibilityAction>) {
    const {nodeName, visible} = action.payload;

    const view: PrincipalValue = visible ? "public" : "private";
    const nodeCard = yield* select(state => getNodeCard(state, nodeName));

    if (nodeCard == null || !nodeCard.friendship.loaded) {
        return;
    }

    try {
        const friends = yield* call(Node.updateFriends, action, REL_HOME,
            [{nodeName, groups: nodeCard.friendship.groups?.map(({id}) => ({id, operations: {view}})) ?? null}]);
        if (friends.length > 0) {
            yield* put(friendshipUpdated(friends[0]).causedBy(action));
        }
    } catch (e) {
        yield* put(friendshipUpdateFailed(nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* peopleSelectedSubscribeSaga(action: WithContext<PeopleSelectedSubscribeAction>) {
    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => !c.hasFeedSubscription);
    yield* put(openProgressBox(0, contacts.length).causedBy(action));
    let done = 0;
    for (const contact of contacts) {
        try {
            const subscription = yield* call(Node.createSubscription, action, REL_HOME,
                {type: "feed" as const, feedName: "news", remoteNodeName: contact.nodeName, remoteFeedName: "timeline"});
            yield* put(feedSubscribed(contact.nodeName, subscription).causedBy(action));
            yield* put(updateProgressBox(++done, contacts.length).causedBy(action));
        } catch (e) {
            yield* put(errorThrown(e));
        }
    }
    yield* put(closeProgressBox().causedBy(action));
}

function* peopleSelectedUnsubscribeSaga(action: WithContext<PeopleSelectedUnsubscribeAction>) {
    const contacts = yield* select(getPeopleSelectedContacts);
    const remoteFeeds: RemoteFeed[] = contacts
        .filter(c => c.hasFeedSubscription)
        .map(c => ({nodeName: c.nodeName, feedName: "timeline"}));
    yield* put(openProgressBox().causedBy(action));
    let subscriptions: SubscriptionInfo[] = [];
    try {
        subscriptions = (
            yield* call(Node.searchSubscriptions, action, REL_HOME, {type: "feed" as const, feeds: remoteFeeds})
        ).filter(sr => isPrincipalIn("delete", sr, "admin", "admin"));
    } catch (e) {
        yield* put(errorThrown(e));
        yield* put(closeProgressBox().causedBy(action));
        return;
    }
    yield* put(updateProgressBox(0, subscriptions.length).causedBy(action));
    let done = 0;
    for (const subscription of subscriptions) {
        try {
            const contact = yield* call(Node.deleteSubscription, action, REL_HOME, subscription.id);
            yield* put(feedUnsubscribed(subscription.remoteNodeName, "timeline", contact).causedBy(action));
            yield* put(updateProgressBox(++done, subscriptions.length).causedBy(action));
        } catch (e) {
            yield* put(errorThrown(e));
        }
    }
    yield* put(closeProgressBox().causedBy(action));
}

function* updateSelectedFriendship(action: WithContext<ClientAction>, friendDescriptions: FriendDescription[]) {
    try {
        yield* put(openProgressBox(0, friendDescriptions.length).causedBy(action));
        const friends = yield* call(Node.updateFriends, action, REL_HOME, friendDescriptions);
        let done = 0;
        for (const friend of friends) {
            yield* put(friendshipUpdated(friend).causedBy(action));
            yield* put(updateProgressBox(++done, friends.length).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox().causedBy(action));
}

function* peopleSelectedFriendSaga(action: WithContext<PeopleSelectedFriendAction>) {
    const friendsId = (yield* select(getHomeFriendsId));
    if (friendsId == null) {
        return;
    }
    const friendDescriptions: FriendDescription[] = (yield* select(getPeopleSelectedContacts))
        .filter(c => !c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: [{id: friendsId}]}));
    yield* call(updateSelectedFriendship, action, friendDescriptions);
}

function* peopleSelectedUnfriendSaga(action: WithContext<PeopleSelectedUnfriendAction>) {
    const friendDescriptions: FriendDescription[] = (yield* select(getPeopleSelectedContacts))
        .filter(c => c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: []}));
    yield* call(updateSelectedFriendship, action, friendDescriptions);
}

function* peopleSelectedAskSaga(action: WithContext<PeopleSelectedAskAction>) {
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
    yield* put(openProgressBox(0, contacts.length).causedBy(action));
    try {
        let done = 0;
        for (const contact of contacts) {
            const features = yield* call(Node.getFeatures, action, contact.nodeName);
            if (features.ask != null && features.ask.includes(subject)) {
                let friendsId = null;
                if (subject === "friend") {
                    friendsId = features.friendGroups?.available.find(fg => fg.title === "t:friends")?.id ?? null;
                }
                if (subject === "subscribe" || friendsId != null) {
                    yield* call(Node.askRemoteNode, action, REL_HOME, contact.nodeName,
                        {subject, friendGroupId: friendsId, message});
                }
            }
            yield* put(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox().causedBy(action));
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
    yield* put(openProgressBox(0, contacts.length).causedBy(action));
    try {
        let done = 0;
        for (const contact of contacts) {
            let subscriber = (yield* call(Node.getSubscribers, action, REL_HOME, contact.nodeName, "feed" as const,
                null, null, ["authentication.required"]))?.[0];
            if (subscriber != null) {
                yield* call(nodeFeedSubscriberSetVisibility, action, subscriber.id, visible, homeOwnerName);
            }
            yield* put(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox().causedBy(action));
}

function* peopleSelectedSubscriptionSetVisibilitySaga(
    action: WithContext<PeopleSelectedSubscriptionSetVisibilityAction>
) {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = (yield* select(getPeopleSelectedContacts)).filter(c => c.hasFeedSubscription);
    if (contacts.length === 0) {
        return;
    }
    yield* put(openProgressBox(0, contacts.length).causedBy(action));
    try {
        let done = 0;
        for (const contact of contacts) {
            let subscription = (yield* call(Node.getSubscriptions, action, REL_HOME, contact.nodeName, "feed" as const,
                ["authentication.required"]))?.[0];
            if (subscription != null) {
                yield* call(nodeFeedSubscriptionSetVisibility, action, subscription.id, visible, homeOwnerName);
            }
            yield* put(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox().causedBy(action));
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
    yield* put(openProgressBox(0, contacts.length).causedBy(action));
    const view: PrincipalValue = visible ? "public" : "private";
    try {
        let done = 0;
        for (const contact of contacts) {
            const {groups} = yield* call(Node.getFriend, action, REL_HOME, contact.nodeName);
            const friends = yield* call(Node.updateFriends, action, REL_HOME,
                [{nodeName: contact.nodeName, groups: groups?.map(({id}) => ({id, operations: {view}})) ?? null}]);
            if (friends.length > 0) {
                yield* put(friendshipUpdated(friends[0]).causedBy(action));
            }
            yield* put(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox().causedBy(action));
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
    yield* put(openProgressBox(0, progressTotal).causedBy(action));
    const added: FriendGroupInfo[] = [];
    try {
        for (let i = 0; i < addedGroupTitles.length; i++) {
            if (!addedGroupTitles[i]) {
                yield* put(updateProgressBox(i + 1, progressTotal).causedBy(action));
                continue;
            }
            const group = yield* call(Node.createFriendGroup, action, REL_HOME,
                {title: addedGroupTitles[i], operations: {view: addedGroupView[i]}});
            added.push(group);
            if (addedGroups.includes(i)) {
                includedGroups.push(group.id);
            }
            yield* put(updateProgressBox(i + 1, progressTotal).causedBy(action));
        }
        let done = 0;
        for (const contact of contacts) {
            const {groups} = yield* call(Node.getFriend, action, REL_HOME, contact.nodeName);
            if (groups != null && groups.length > 0) {
                const newGroups = groups
                    .filter(gr => !excludedGroups.includes(gr.id))
                    .map(({id, operations}) => ({id, operations}));
                const view: PrincipalValue = groups[0].operations?.view ?? "public";
                includedGroups.forEach(id => newGroups.push({id, operations: {view}}));
                const friends = yield* call(Node.updateFriends, action, REL_HOME,
                    [{nodeName: contact.nodeName, groups: newGroups}]);
                if (friends.length > 0) {
                    yield* put(friendshipUpdated(friends[0]).causedBy(action));
                }
            }
            yield* put(updateProgressBox(addedGroupTitles.length + (++done), progressTotal).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
    yield* put(closeProgressBox().causedBy(action));
    for (const group of added) {
        yield* put(friendGroupAdded(homeOwnerName, group).causedBy(action));
    }
}

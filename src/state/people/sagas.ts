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
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
import { getHomeFriendsId } from "state/home/selectors";
import { getNodeFriendGroups, isPrincipalIn } from "state/node/selectors";
import { nodeCardsPreload } from "state/nodecards/actions";
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
    executor("PEOPLE_GENERAL_LOAD", "", peopleGeneralLoadSaga),
    executor("SUBSCRIBERS_LOAD", "", subscribersLoadSaga),
    executor("SUBSCRIPTIONS_LOAD", "", subscriptionsLoadSaga),
    executor("FRIENDS_LOAD", "", friendsLoadSaga),
    executor("FRIEND_OFS_LOAD", "", friendOfsLoadSaga),
    executor("BLOCKED_LOAD", "", blockedLoadSaga),
    executor("BLOCKED_BY_LOAD", "", blockedByLoadSaga),
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

function peopleGoToDefaultTabSaga(action: PeopleGoToDefaultTabAction): void {
    const {loaded, tab, friendGroups, ...visible} = select(state => ({
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
    dispatch(peopleGoToTab(targetTab).causedBy(action));
}

async function peopleGeneralLoadSaga(action: WithContext<PeopleGeneralLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const info = await Node.getPeopleGeneral(action, REL_CURRENT);
        dispatch(peopleGeneralLoaded(info).causedBy(action));
    } catch (e) {
        dispatch(peopleGeneralLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function subscribersLoadSaga(action: WithContext<SubscribersLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const subscribers = await Node.getSubscribers(
            action, REL_CURRENT, null, "feed" as const, null, null, ["authentication.required"]
        );
        dispatch(subscribersLoaded(subscribers).causedBy(action));
        dispatch(nodeCardsPreload(subscribers.map(sr => sr.nodeName)).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(subscribersLoaded([]).causedBy(action));
        } else {
            dispatch(subscribersLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function subscriptionsLoadSaga(action: WithContext<SubscriptionsLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const subscriptions = await Node.getSubscriptions(
            action, REL_CURRENT, null, "feed" as const, ["authentication.required"]
        );
        dispatch(subscriptionsLoaded(subscriptions).causedBy(action));
        dispatch(nodeCardsPreload(subscriptions.map(sr => sr.remoteNodeName)).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(subscriptionsLoaded([]).causedBy(action));
        } else {
            dispatch(subscriptionsLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function friendsLoadSaga(action: WithContext<FriendsLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const friends = await Node.getFriends(action, REL_CURRENT);
        dispatch(friendsLoaded(friends).causedBy(action));
        dispatch(nodeCardsPreload(friends.map(fr => fr.nodeName)).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(friendsLoaded([]).causedBy(action));
        } else {
            dispatch(friendsLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function friendOfsLoadSaga(action: WithContext<FriendOfsLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const friendOfs = await Node.getFriendOfs(action, REL_CURRENT);
        dispatch(friendOfsLoaded(friendOfs).causedBy(action));
        dispatch(nodeCardsPreload(friendOfs.map(fr => fr.remoteNodeName)).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(friendOfsLoaded([]).causedBy(action));
        } else {
            dispatch(friendOfsLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function blockedLoadSaga(action: WithContext<BlockedLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const blocked = await Node.searchBlockedUsers(
            action, REL_CURRENT, {blockedOperations: ["comment" as const, "reaction" as const, "visibility" as const]}
        );
        dispatch(blockedLoaded(blocked).causedBy(action));
        dispatch(nodeCardsPreload(blocked.map(b => b.nodeName)).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(blockedLoaded([]).causedBy(action));
        } else {
            dispatch(blockedLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function blockedByLoadSaga(action: WithContext<BlockedByLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const blockedBy = await Node.searchBlockedByUsers(action, REL_CURRENT, {strict: true});
        dispatch(blockedByLoaded(blockedBy).causedBy(action));
        dispatch(nodeCardsPreload(blockedBy.map(b => b.nodeName)).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(blockedByLoaded([]).causedBy(action));
        } else {
            dispatch(blockedByLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function friendshipUpdateSaga(action: WithContext<FriendshipUpdateAction>): Promise<void> {
    const {nodeName, friendGroups, storyId} = action.payload;

    try {
        const friends = await Node.updateFriends(
            action, REL_HOME, [{nodeName, groups: friendGroups?.map(id => ({id})) ?? null}]
        );
        if (friends.length > 0) {
            dispatch(friendshipUpdated(friends[0]).causedBy(action));
        }
        if (storyId != null) {
            dispatch(storySatisfy(REL_HOME, "instant", storyId).causedBy(action));
        }
        if (friendGroups != null && friendGroups.length > 0) {
            await subscribeToFriend(action, nodeName);
        }
    } catch (e) {
        dispatch(friendshipUpdateFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function subscribeToFriend(action: WithContext<FriendshipUpdateAction>, nodeName: string): Promise<void> {
    const subscriptions = await Node.getSubscriptions(
        action, REL_HOME, nodeName, "feed" as const, ["authentication.required"]
    );
    if (subscriptions.length > 0) {
        return;
    }

    const add = select(state => getSetting(state, "friends.subscribe-on-add") as string);

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

        dispatch(confirmBox({
            message: i18n.t("not-subscribed-friend"), onYes, onNo, variant: "primary", dontShowAgainBox: true
        }).causedBy(action));
    } else if (add === "yes") {
        dispatch(feedSubscribe(nodeName, "timeline").causedBy(action));
    }
}

async function friendshipSetVisibilitySaga(action: WithContext<FriendshipSetVisibilityAction>): Promise<void> {
    const {nodeName, visible} = action.payload;

    const view: PrincipalValue = visible ? "public" : "private";
    const nodeCard = select(state => getNodeCard(state, nodeName));

    if (nodeCard == null || !nodeCard.friendship.loaded) {
        return;
    }

    try {
        const friends = await Node.updateFriends(
            action, REL_HOME,
            [{nodeName, groups: nodeCard.friendship.groups?.map(({id}) => ({id, operations: {view}})) ?? null}]
        );
        if (friends.length > 0) {
            dispatch(friendshipUpdated(friends[0]).causedBy(action));
        }
    } catch (e) {
        dispatch(friendshipUpdateFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function peopleSelectedSubscribeSaga(action: WithContext<PeopleSelectedSubscribeAction>): Promise<void> {
    const contacts = select(getPeopleSelectedContacts).filter(c => !c.hasFeedSubscription);
    dispatch(openProgressBox(0, contacts.length).causedBy(action));
    let done = 0;
    for (const contact of contacts) {
        try {
            const subscription = await Node.createSubscription(
                action, REL_HOME,
                {type: "feed" as const, feedName: "news", remoteNodeName: contact.nodeName, remoteFeedName: "timeline"}
            );
            dispatch(feedSubscribed(contact.nodeName, subscription).causedBy(action));
            dispatch(updateProgressBox(++done, contacts.length).causedBy(action));
        } catch (e) {
            dispatch(errorThrown(e));
        }
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function peopleSelectedUnsubscribeSaga(action: WithContext<PeopleSelectedUnsubscribeAction>): Promise<void> {
    const contacts = select(getPeopleSelectedContacts);
    const remoteFeeds: RemoteFeed[] = contacts
        .filter(c => c.hasFeedSubscription)
        .map(c => ({nodeName: c.nodeName, feedName: "timeline"}));
    dispatch(openProgressBox().causedBy(action));
    let subscriptions: SubscriptionInfo[] = [];
    try {
        subscriptions = (
            await Node.searchSubscriptions(action, REL_HOME, {type: "feed" as const, feeds: remoteFeeds})
        ).filter(sr => isPrincipalIn("delete", sr, "admin", "admin"));
    } catch (e) {
        dispatch(errorThrown(e));
        dispatch(closeProgressBox().causedBy(action));
        return;
    }
    dispatch(updateProgressBox(0, subscriptions.length).causedBy(action));
    let done = 0;
    for (const subscription of subscriptions) {
        try {
            const contact = await Node.deleteSubscription(action, REL_HOME, subscription.id);
            dispatch(feedUnsubscribed(subscription.remoteNodeName, "timeline", contact).causedBy(action));
            dispatch(updateProgressBox(++done, subscriptions.length).causedBy(action));
        } catch (e) {
            dispatch(errorThrown(e));
        }
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function updateSelectedFriendship(
    action: WithContext<ClientAction>, friendDescriptions: FriendDescription[]
): Promise<void> {
    try {
        dispatch(openProgressBox(0, friendDescriptions.length).causedBy(action));
        const friends = await Node.updateFriends(action, REL_HOME, friendDescriptions);
        let done = 0;
        for (const friend of friends) {
            dispatch(friendshipUpdated(friend).causedBy(action));
            dispatch(updateProgressBox(++done, friends.length).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function peopleSelectedFriendSaga(action: WithContext<PeopleSelectedFriendAction>): Promise<void> {
    const friendsId = select(getHomeFriendsId);
    if (friendsId == null) {
        return;
    }
    const friendDescriptions: FriendDescription[] = select(getPeopleSelectedContacts)
        .filter(c => !c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: [{id: friendsId}]}));
    await updateSelectedFriendship(action, friendDescriptions);
}

async function peopleSelectedUnfriendSaga(action: WithContext<PeopleSelectedUnfriendAction>): Promise<void> {
    const friendDescriptions: FriendDescription[] = select(getPeopleSelectedContacts)
        .filter(c => c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: []}));
    await updateSelectedFriendship(action, friendDescriptions);
}

async function peopleSelectedAskSaga(action: WithContext<PeopleSelectedAskAction>): Promise<void> {
    const {subject, message} = action.payload;

    let contacts = select(getPeopleSelectedContacts);
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
    dispatch(openProgressBox(0, contacts.length).causedBy(action));
    try {
        let done = 0;
        for (const contact of contacts) {
            const features = await Node.getFeatures(action, contact.nodeName);
            if (features.ask != null && features.ask.includes(subject)) {
                let friendsId = null;
                if (subject === "friend") {
                    friendsId = features.friendGroups?.available.find(fg => fg.title === "t:friends")?.id ?? null;
                }
                if (subject === "subscribe" || friendsId != null) {
                    await Node.askRemoteNode(
                        action, REL_HOME, contact.nodeName,
                        {subject, friendGroupId: friendsId, message}
                    );
                }
            }
            dispatch(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function peopleSelectedSubscriberSetVisibilitySaga(
    action: WithContext<PeopleSelectedSubscriberSetVisibilityAction>
): Promise<void> {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = select(getPeopleSelectedContacts).filter(c => c.hasFeedSubscriber);
    if (contacts.length === 0) {
        return;
    }
    dispatch(openProgressBox(0, contacts.length).causedBy(action));
    try {
        let done = 0;
        for (const contact of contacts) {
            let subscriber = (await Node.getSubscribers(
                action, REL_HOME, contact.nodeName, "feed" as const, null, null, ["authentication.required"])
            )?.[0];
            if (subscriber != null) {
                await nodeFeedSubscriberSetVisibility(action, subscriber.id, visible);
            }
            dispatch(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function peopleSelectedSubscriptionSetVisibilitySaga(
    action: WithContext<PeopleSelectedSubscriptionSetVisibilityAction>
): Promise<void> {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = select(getPeopleSelectedContacts).filter(c => c.hasFeedSubscription);
    if (contacts.length === 0) {
        return;
    }
    dispatch(openProgressBox(0, contacts.length).causedBy(action));
    try {
        let done = 0;
        for (const contact of contacts) {
            let subscription = (await Node.getSubscriptions(
                action, REL_HOME, contact.nodeName, "feed" as const, ["authentication.required"])
            )?.[0];
            if (subscription != null) {
                await nodeFeedSubscriptionSetVisibility(action, subscription.id, visible);
            }
            dispatch(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function peopleSelectedFriendshipSetVisibilitySaga(
    action: WithContext<PeopleSelectedFriendshipSetVisibilityAction>
): Promise<void> {
    const {visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = select(getPeopleSelectedContacts).filter(c => c.hasFriend);
    if (contacts.length === 0) {
        return;
    }
    dispatch(openProgressBox(0, contacts.length).causedBy(action));
    const view: PrincipalValue = visible ? "public" : "private";
    try {
        let done = 0;
        for (const contact of contacts) {
            const {groups} = await Node.getFriend(action, REL_HOME, contact.nodeName);
            const friends = await Node.updateFriends(
                action, REL_HOME,
                [{nodeName: contact.nodeName, groups: groups?.map(({id}) => ({id, operations: {view}})) ?? null}]
            );
            if (friends.length > 0) {
                dispatch(friendshipUpdated(friends[0]).causedBy(action));
            }
            dispatch(updateProgressBox(++done, contacts.length).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
    dispatch(closeProgressBox().causedBy(action));
}

async function peopleSelectedChangeFriendGroupsSaga(
    action: WithContext<PeopleSelectedChangeFriendGroupsAction>
): Promise<void> {
    const {includedGroups, excludedGroups, addedGroups, addedGroupTitles, addedGroupView} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    const contacts = select(getPeopleSelectedContacts).filter(c => c.hasFriend);
    if (contacts.length === 0) {
        return;
    }

    const progressTotal = addedGroupTitles.length + contacts.length;
    dispatch(openProgressBox(0, progressTotal).causedBy(action));
    const added: FriendGroupInfo[] = [];
    try {
        for (let i = 0; i < addedGroupTitles.length; i++) {
            if (!addedGroupTitles[i]) {
                dispatch(updateProgressBox(i + 1, progressTotal).causedBy(action));
                continue;
            }
            const group = await Node.createFriendGroup(
                action, REL_HOME,
                {title: addedGroupTitles[i], operations: {view: addedGroupView[i]}}
            );
            added.push(group);
            if (addedGroups.includes(i)) {
                includedGroups.push(group.id);
            }
            dispatch(updateProgressBox(i + 1, progressTotal).causedBy(action));
        }
        let done = 0;
        for (const contact of contacts) {
            const {groups} = await Node.getFriend(action, REL_HOME, contact.nodeName);
            if (groups != null && groups.length > 0) {
                const newGroups = groups
                    .filter(gr => !excludedGroups.includes(gr.id))
                    .map(({id, operations}) => ({id, operations}));
                const view: PrincipalValue = groups[0].operations?.view ?? "public";
                includedGroups.forEach(id => newGroups.push({id, operations: {view}}));
                const friends = await Node.updateFriends(
                    action, REL_HOME, [{nodeName: contact.nodeName, groups: newGroups}]
                );
                if (friends.length > 0) {
                    dispatch(friendshipUpdated(friends[0]).causedBy(action));
                }
            }
            dispatch(updateProgressBox(addedGroupTitles.length + (++done), progressTotal).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
    dispatch(closeProgressBox().causedBy(action));
    for (const group of added) {
        dispatch(friendGroupAdded(homeOwnerName, group).causedBy(action));
    }
}

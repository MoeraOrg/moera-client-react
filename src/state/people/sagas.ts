import { call, put, select } from 'typed-redux-saga';

import { NodeApiError } from "api";
import { Node } from "api/node";
import { FriendDescription, PrincipalValue, RemoteFeed, SubscriptionInfo } from "api/node/api-types";
import { errorThrown } from "state/error/actions";
import {
    FRIEND_OFS_LOAD,
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
    PEOPLE_SELECTED_ASK,
    PEOPLE_SELECTED_FRIEND,
    PEOPLE_SELECTED_SUBSCRIBE,
    PEOPLE_SELECTED_UNFRIEND,
    PEOPLE_SELECTED_UNSUBSCRIBE,
    peopleGeneralLoaded,
    peopleGeneralLoadFailed,
    PeopleSelectedAskAction,
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
import { getNodeCard } from "state/nodecards/selectors";
import { storySatisfy } from "state/stories/actions";
import { getPeopleSelectedContacts } from "state/people/selectors";
import { feedSubscribed, feedUnsubscribed } from "state/feeds/actions";
import { closeProgressBox, openProgressBox, updateProgressBox } from "state/progressbox/actions";

export default [
    executor(PEOPLE_GENERAL_LOAD, "", peopleGeneralLoadSaga, introduced),
    executor(SUBSCRIBERS_LOAD, "", subscribersLoadSaga, introduced),
    executor(SUBSCRIPTIONS_LOAD, "", subscriptionsLoadSaga, introduced),
    executor(FRIENDS_LOAD, "", friendsLoadSaga, introduced),
    executor(FRIEND_OFS_LOAD, "", friendOfsLoadSaga, introduced),
    executor(FRIENDSHIP_UPDATE, payload => payload.nodeName, friendshipUpdateSaga),
    executor(FRIENDSHIP_SET_VISIBILITY, payload => payload.nodeName, friendshipSetVisibilitySaga),
    executor(PEOPLE_SELECTED_SUBSCRIBE, "", peopleSelectedSubscribeSaga),
    executor(PEOPLE_SELECTED_UNSUBSCRIBE, "", peopleSelectedUnsubscribeSaga),
    executor(PEOPLE_SELECTED_FRIEND, "", peopleSelectedFriendSaga),
    executor(PEOPLE_SELECTED_UNFRIEND, "", peopleSelectedUnfriendSaga),
    executor(PEOPLE_SELECTED_ASK, "", peopleSelectedAskSaga)
];

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
        const friends = yield* call(Node.getFriendOfs, "");
        yield* put(friendOfsLoaded(friends));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(friendOfsLoaded([]));
        } else {
            yield* put(friendOfsLoadFailed());
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
        subscriptions = yield* call(Node.searchSubscriptions, ":", "feed", remoteFeeds, null);
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

function* peopleSelectedFriendSaga() {
    const friendsId = (yield* select(getHomeFriendsId));
    if (friendsId == null) {
        return;
    }
    const friendDescriptions: FriendDescription[] = (yield* select(getPeopleSelectedContacts))
        .filter(c => !c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: [{id: friendsId}]}));
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

function* peopleSelectedUnfriendSaga() {
    const friendDescriptions: FriendDescription[] = (yield* select(getPeopleSelectedContacts))
        .filter(c => c.hasFriend)
        .map(c => ({nodeName: c.nodeName, groups: []}));
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

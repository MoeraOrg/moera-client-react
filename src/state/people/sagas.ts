import { call, put, select } from 'typed-redux-saga';

import { NodeApiError } from "api";
import { Node } from "api/node";
import { PrincipalValue } from "api/node/api-types";
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
    PEOPLE_SELECTED_SUBSCRIBE,
    peopleGeneralLoaded,
    peopleGeneralLoadFailed,
    peopleSelectedProceeded,
    SUBSCRIBERS_LOAD,
    subscribersLoaded,
    subscribersLoadFailed,
    SUBSCRIPTIONS_LOAD,
    subscriptionsLoaded,
    subscriptionsLoadFailed
} from "state/people/actions";
import { executor } from "state/executor";
import { introduced } from "state/init-selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { storySatisfy } from "state/stories/actions";
import { getPeopleSelectedContacts } from "state/people/selectors";
import { feedSubscribed } from "state/feeds/actions";

export default [
    executor(PEOPLE_GENERAL_LOAD, "", peopleGeneralLoadSaga, introduced),
    executor(SUBSCRIBERS_LOAD, "", subscribersLoadSaga, introduced),
    executor(SUBSCRIPTIONS_LOAD, "", subscriptionsLoadSaga, introduced),
    executor(FRIENDS_LOAD, "", friendsLoadSaga, introduced),
    executor(FRIEND_OFS_LOAD, "", friendOfsLoadSaga, introduced),
    executor(FRIENDSHIP_UPDATE, payload => payload.nodeName, friendshipUpdateSaga),
    executor(FRIENDSHIP_SET_VISIBILITY, payload => payload.nodeName, friendshipSetVisibilitySaga),
    executor(PEOPLE_SELECTED_SUBSCRIBE, "", peopleSelectedSubscribeSaga)
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
        yield* put(friendshipUpdated(nodeName, friends[0]?.groups ?? null))
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
        yield* put(friendshipUpdated(nodeName, friends[0]?.groups ?? null))
    } catch (e) {
        yield* put(friendshipUpdateFailed(nodeName));
        yield* put(errorThrown(e));
    }
}

function* peopleSelectedSubscribeSaga() {
    const contacts = yield* select(getPeopleSelectedContacts);
    for (const contact of contacts) {
        if (contact.hasFeedSubscription) {
            continue;
        }

        try {
            const subscription = yield* call(Node.postFeedSubscription, ":", contact.nodeName, "timeline");
            yield* put(feedSubscribed(contact.nodeName, subscription));
        } catch (e) {
            yield* put(errorThrown(e));
        }
    }
    yield* put(peopleSelectedProceeded());
}

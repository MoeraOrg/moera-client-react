import i18n from 'i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE, SHERIFF_USER_LIST_HIDE } from "sheriffs";
import {
    BlockedByUserInfo,
    BlockedUserInfo,
    FriendGroupDetails,
    HomeNotConnectedError,
    Node,
    NodeApiError,
    SubscriberInfo,
    SubscriptionInfo
} from "api";
import { executor } from "state/executor";
import { mutuallyIntroduced } from "state/init-barriers";
import { dispatch, select } from "state/store-sagas";
import {
    nodeCardBlockingLoad,
    NodeCardBlockingLoadAction,
    nodeCardBlockingLoadFailed,
    nodeCardBlockingSet,
    nodeCardDetailsLoad,
    NodeCardDetailsLoadAction,
    nodeCardDetailsLoadFailed,
    nodeCardDetailsSet,
    nodeCardFriendshipLoad,
    NodeCardFriendshipLoadAction,
    nodeCardFriendshipLoadFailed,
    nodeCardFriendshipSet,
    nodeCardPeopleLoad,
    NodeCardPeopleLoadAction,
    nodeCardPeopleLoadFailed,
    nodeCardPeopleSet,
    nodeCardPrepare,
    NodeCardPrepareAction,
    NodeCardPrepareOwnersAction,
    nodeCardSheriffListLoad,
    NodeCardSheriffListLoadAction,
    nodeCardSheriffListSet,
    nodeCardStoriesLoad,
    NodeCardStoriesLoadAction,
    nodeCardStoriesSet,
    nodeCardSubscriptionLoad,
    NodeCardSubscriptionLoadAction,
    nodeCardSubscriptionLoadFailed,
    nodeCardSubscriptionSet,
    SheriffListAddAction,
    SheriffListDeleteAction
} from "state/nodecards/actions";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { flashBox } from "state/flashbox/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("NODE_CARD_PREPARE_OWNERS", "", nodeCardPrepareOwnersSaga),
    executor("NODE_CARD_PREPARE", payload => payload.nodeName, nodeCardPrepareSaga),
    executor("NODE_CARD_DETAILS_LOAD", payload => payload.nodeName, nodeCardDetailsLoadSaga),
    executor("NODE_CARD_PEOPLE_LOAD", payload => payload.nodeName, nodeCardPeopleLoadSaga),
    executor("NODE_CARD_STORIES_LOAD", payload => payload.nodeName, nodeCardStoriesLoadSaga),
    executor("NODE_CARD_SUBSCRIPTION_LOAD", payload => payload.nodeName, nodeCardSubscriptionLoadSaga),
    executor("NODE_CARD_FRIENDSHIP_LOAD", payload => payload.nodeName, nodeCardFriendshipLoadSaga),
    executor("NODE_CARD_BLOCKING_LOAD", payload => payload.nodeName, nodeCardBlockingLoadSaga),
    executor("NODE_CARD_SHERIFF_LIST_LOAD", payload => payload.nodeName, nodeCardSheriffListLoadSaga),
    executor("SHERIFF_LIST_ADD", payload => payload.nodeName, sheriffListAddSaga),
    executor("SHERIFF_LIST_DELETE", payload => payload.nodeName, sheriffListDeleteSaga)
];

async function nodeCardPrepareOwnersSaga(action: WithContext<NodeCardPrepareOwnersAction>): Promise<void> {
    await mutuallyIntroduced();
    const {ownerNameOrUrl, homeOwnerNameOrUrl} = action.context;
    if (ownerNameOrUrl) {
        dispatch(nodeCardPrepare(ownerNameOrUrl).causedBy(action));
    }
    if (homeOwnerNameOrUrl && homeOwnerNameOrUrl !== ownerNameOrUrl) {
        dispatch(nodeCardPrepare(homeOwnerNameOrUrl).causedBy(action));
    }
}

async function nodeCardPrepareSaga(action: WithContext<NodeCardPrepareAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    const card = getNodeCard(select(), nodeName);
    if (card == null || (!card.details.loaded && !card.details.loading)) {
        dispatch(nodeCardDetailsLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.people.loaded && !card.people.loading)) {
        dispatch(nodeCardPeopleLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.stories.loaded && !card.stories.loading)) {
        dispatch(nodeCardStoriesLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.subscription.loaded && !card.subscription.loading)) {
        dispatch(nodeCardSubscriptionLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.friendship.loaded && !card.friendship.loading)) {
        dispatch(nodeCardFriendshipLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.blocking.loaded && !card.blocking.loading)) {
        dispatch(nodeCardBlockingLoad(nodeName).causedBy(action));
    }
    if (homeOwnerName === SHERIFF_GOOGLE_PLAY_TIMELINE
        && (card == null || (!card.sheriffList.loaded && !card.sheriffList.loading))) {

        dispatch(nodeCardSheriffListLoad(nodeName).causedBy(action));
    }
}

async function nodeCardDetailsLoadSaga(action: WithContext<NodeCardDetailsLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    try {
        const profile = await Node.getProfile(action, nodeName);
        dispatch(nodeCardDetailsSet(nodeName, profile).causedBy(action));
    } catch (e) {
        dispatch(nodeCardDetailsLoadFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function nodeCardPeopleLoadSaga(action: WithContext<NodeCardPeopleLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    try {
        const info = await Node.getPeopleGeneral(action, nodeName);
        dispatch(nodeCardPeopleSet(
            nodeName, info.feedSubscribersTotal ?? null, info.feedSubscriptionsTotal ?? null
        ).causedBy(action));
    } catch (e) {
        dispatch(nodeCardPeopleLoadFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function nodeCardStoriesLoadSaga(action: WithContext<NodeCardStoriesLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    try {
        const {total, lastCreatedAt = null} = await Node.getFeedGeneral(action, nodeName, "timeline");
        dispatch(nodeCardStoriesSet(nodeName, total, lastCreatedAt).causedBy(action));
    } catch (e) {
        dispatch(nodeCardDetailsLoadFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function nodeCardSubscriptionLoadSaga(action: WithContext<NodeCardSubscriptionLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    try {
        const [subscriber, subscription] = await Promise.all([
            loadSubscriber(action, nodeName),
            loadSubscription(action, nodeName)
        ]);
        dispatch(nodeCardSubscriptionSet(nodeName, subscriber ?? null, subscription ?? null).causedBy(action));
    } catch (e) {
        dispatch(nodeCardSubscriptionLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof HomeNotConnectedError)) {
            dispatch(errorThrown(e));
        }
    }
}

async function loadSubscriber(
    action: WithContext<NodeCardSubscriptionLoadAction>, nodeName: string
): Promise<SubscriberInfo | null> {
    const {homeOwnerName} = action.context;
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    const subscribers = await Node.getSubscribers(
        action, REL_HOME, nodeName, "feed" as const, null, null, ["authentication.required"]
    );
    return subscribers?.[0];
}

async function loadSubscription(
    action: WithContext<NodeCardSubscriptionLoadAction>, nodeName: string
): Promise<SubscriptionInfo | null> {
    const {homeOwnerName} = action.context;
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    const subscriptions = await Node.getSubscriptions(
        action, REL_HOME, nodeName, "feed" as const, ["authentication.required"]
    );
    return subscriptions?.[0];
}

async function nodeCardFriendshipLoadSaga(action: WithContext<NodeCardFriendshipLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    try {
        const [groups, remoteGroups] = await Promise.all([
            loadFriendGroups(action, nodeName),
            loadRemoteFriendGroups(action, nodeName)
        ]);
        dispatch(nodeCardFriendshipSet(nodeName, groups ?? null, remoteGroups ?? null).causedBy(action));
    } catch (e) {
        dispatch(nodeCardFriendshipLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof HomeNotConnectedError)) {
            dispatch(errorThrown(e));
        }
    }
}

async function loadFriendGroups(
    action: WithContext<NodeCardFriendshipLoadAction>, nodeName: string
): Promise<FriendGroupDetails[] | null | undefined> {
    const {homeOwnerName} = action.context;
    if (!homeOwnerName || !nodeName || nodeName === homeOwnerName) {
        return null;
    }
    const {groups} = await Node.getFriend(action, REL_HOME, nodeName);
    return groups;
}

async function loadRemoteFriendGroups(
    action: WithContext<NodeCardFriendshipLoadAction>, nodeName: string
): Promise<FriendGroupDetails[] | null | undefined> {
    const {homeOwnerName} = action.context;
    if (!homeOwnerName || !nodeName || nodeName === homeOwnerName) {
        return null;
    }
    const {groups} = await Node.getFriend(action, nodeName, homeOwnerName);
    return groups;
}

async function nodeCardBlockingLoadSaga(action: WithContext<NodeCardBlockingLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;
    try {
        const [blocked, blockedBy] = await Promise.all([
            loadBlocked(action, nodeName),
            loadBlockedBy(action, nodeName)
        ]);
        dispatch(nodeCardBlockingSet(nodeName, blocked ?? null, blockedBy ?? null).causedBy(action));
    } catch (e) {
        dispatch(nodeCardBlockingLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof HomeNotConnectedError)) {
            dispatch(errorThrown(e));
        }
    }
}

async function loadBlocked(
    action: WithContext<NodeCardBlockingLoadAction>, nodeName: string
): Promise<BlockedUserInfo[] | null> {
    const {homeOwnerName} = action.context;
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    return Node.searchBlockedUsers(action, REL_HOME, {
        nodeName,
        blockedOperations: ["comment" as const, "reaction" as const, "visibility" as const, "instant" as const]
    });
}

async function loadBlockedBy(
    action: WithContext<NodeCardBlockingLoadAction>, nodeName: string
): Promise<BlockedByUserInfo[] | null> {
    const {homeOwnerName} = action.context;
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    return Node.searchBlockedByUsers(action, REL_HOME, {postings: [{nodeName}]});
}

async function nodeCardSheriffListLoadSaga(action: WithContext<NodeCardSheriffListLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const {nodeName} = action.payload;

    if (nodeName.search(/[/:]/g) >= 0) {
        // FIXME dirty hack to avoid URLs as node names in the request's URL - this creates a malformed URL and
        // causes CORS error
        return;
    }

    try {
        await Node.getUserListItem(action, REL_HOME, SHERIFF_USER_LIST_HIDE, nodeName, ["user-list-item.not-found"]);
        dispatch(nodeCardSheriffListSet(nodeName, true).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "user-list-item.not-found") {
            dispatch(nodeCardSheriffListSet(nodeName, false).causedBy(action));
        } else {
            dispatch(nodeCardBlockingLoadFailed(nodeName).causedBy(action));
            if (!(e instanceof HomeNotConnectedError)) {
                dispatch(errorThrown(e));
            }
        }
    }
}

async function sheriffListAddSaga(action: WithContext<SheriffListAddAction>): Promise<void> {
    const {nodeName} = action.payload;
    try {
        await Node.createUserListItem(action, REL_HOME, SHERIFF_USER_LIST_HIDE, {nodeName});
        dispatch(nodeCardSheriffListSet(nodeName, true).causedBy(action));
        dispatch(flashBox(i18n.t("content-hidden-in-google-play")).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function sheriffListDeleteSaga(action: WithContext<SheriffListDeleteAction>): Promise<void> {
    const {nodeName} = action.payload;
    try {
        await Node.deleteUserListItem(action, REL_HOME, SHERIFF_USER_LIST_HIDE, nodeName);
        dispatch(nodeCardSheriffListSet(nodeName, false).causedBy(action));
        dispatch(flashBox(i18n.t("content-unhidden-in-google-play")).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

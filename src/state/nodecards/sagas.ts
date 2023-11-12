import { all, call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE, SHERIFF_USER_LIST_HIDE } from "sheriffs";
import { HomeNotConnectedError, NameResolvingError, Node, NodeApiError } from "api";
import { executor } from "state/executor";
import { mutuallyIntroduced } from "state/init-selectors";
import {
    nodeCardBlockingLoad,
    NodeCardBlockingLoadAction,
    nodeCardBlockingLoadFailed,
    nodeCardBlockingSet,
    NodeCardCopyMentionAction,
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
    NodeCardPrepareAction,
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
import { Browser } from "ui/browser";
import { mentionName } from "util/misc";

export default [
    executor("NODE_CARD_PREPARE", payload => payload.nodeName, nodeCardPrepareSaga),
    executor("NODE_CARD_DETAILS_LOAD", payload => payload.nodeName, nodeCardDetailsLoadSaga),
    executor("NODE_CARD_PEOPLE_LOAD", payload => payload.nodeName, nodeCardPeopleLoadSaga),
    executor("NODE_CARD_STORIES_LOAD", payload => payload.nodeName, nodeCardStoriesLoadSaga),
    executor("NODE_CARD_SUBSCRIPTION_LOAD", payload => payload.nodeName, nodeCardSubscriptionLoadSaga),
    executor("NODE_CARD_FRIENDSHIP_LOAD", payload => payload.nodeName, nodeCardFriendshipLoadSaga, mutuallyIntroduced),
    executor("NODE_CARD_BLOCKING_LOAD", payload => payload.nodeName, nodeCardBlockingLoadSaga, mutuallyIntroduced),
    executor("NODE_CARD_SHERIFF_LIST_LOAD", payload => payload.nodeName, nodeCardSheriffListLoadSaga, mutuallyIntroduced),
    executor("NODE_CARD_COPY_MENTION", "", nodeCardCopyMention),
    executor("SHERIFF_LIST_ADD", payload => payload.nodeName, sheriffListAddSaga),
    executor("SHERIFF_LIST_DELETE", payload => payload.nodeName, sheriffListDeleteSaga)
];

function* nodeCardPrepareSaga(action: WithContext<NodeCardPrepareAction>) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    const card = yield* select(getNodeCard, nodeName);
    if (card == null || (!card.details.loaded && !card.details.loading)) {
        yield* put(nodeCardDetailsLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.people.loaded && !card.people.loading)) {
        yield* put(nodeCardPeopleLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.stories.loaded && !card.stories.loading)) {
        yield* put(nodeCardStoriesLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.subscription.loaded && !card.subscription.loading)) {
        yield* put(nodeCardSubscriptionLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.friendship.loaded && !card.friendship.loading)) {
        yield* put(nodeCardFriendshipLoad(nodeName).causedBy(action));
    }
    if (card == null || (!card.blocking.loaded && !card.blocking.loading)) {
        yield* put(nodeCardBlockingLoad(nodeName).causedBy(action));
    }
    if (homeOwnerName === SHERIFF_GOOGLE_PLAY_TIMELINE
        && (card == null || (!card.sheriffList.loaded && !card.sheriffList.loading))) {

        yield* put(nodeCardSheriffListLoad(nodeName).causedBy(action));
    }
}

function* nodeCardDetailsLoadSaga(action: NodeCardDetailsLoadAction) {
    const {nodeName} = action.payload;
    try {
        const profile = yield* call(Node.getProfile, action, nodeName);
        yield* put(nodeCardDetailsSet(nodeName, profile).causedBy(action));
    } catch (e) {
        yield* put(nodeCardDetailsLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* nodeCardPeopleLoadSaga(action: NodeCardPeopleLoadAction) {
    const {nodeName} = action.payload;
    try {
        const info = yield* call(Node.getPeopleGeneral, action, nodeName);
        yield* put(nodeCardPeopleSet(
            nodeName, info.feedSubscribersTotal ?? null, info.feedSubscriptionsTotal ?? null
        ).causedBy(action));
    } catch (e) {
        yield* put(nodeCardPeopleLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* nodeCardStoriesLoadSaga(action: NodeCardStoriesLoadAction) {
    const {nodeName} = action.payload;
    try {
        const {total, lastCreatedAt = null} = yield* call(Node.getFeedGeneral, action, nodeName, "timeline");
        yield* put(nodeCardStoriesSet(nodeName, total, lastCreatedAt).causedBy(action));
    } catch (e) {
        yield* put(nodeCardDetailsLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* nodeCardSubscriptionLoadSaga(action: WithContext<NodeCardSubscriptionLoadAction>) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        const {subscriber, subscription} = yield* all({
            subscriber: call(loadSubscriber, action, nodeName, homeOwnerName),
            subscription: call(loadSubscription, action, nodeName, homeOwnerName)
        });
        yield* put(nodeCardSubscriptionSet(nodeName, subscriber ?? null, subscription ?? null).causedBy(action));
    } catch (e) {
        yield* put(nodeCardSubscriptionLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof NameResolvingError) && !(e instanceof HomeNotConnectedError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* loadSubscriber(action: NodeCardSubscriptionLoadAction, nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    const subscribers = yield* call(Node.getSubscribers, action, ":", nodeName, "feed" as const, null, null,
        ["authentication.required"]);
    return subscribers?.[0];
}

function* loadSubscription(action: NodeCardSubscriptionLoadAction, nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    const subscriptions = yield* call(Node.getSubscriptions, action, ":", nodeName, "feed" as const,
        ["authentication.required"]);
    return subscriptions?.[0];
}

function* nodeCardFriendshipLoadSaga(action: WithContext<NodeCardFriendshipLoadAction>) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        const {groups, remoteGroups} = yield* all({
            groups: call(loadFriendGroups, action, nodeName, homeOwnerName),
            remoteGroups: call(loadRemoteFriendGroups, action, nodeName, homeOwnerName)
        });
        yield* put(nodeCardFriendshipSet(nodeName, groups ?? null, remoteGroups ?? null).causedBy(action));
    } catch (e) {
        yield* put(nodeCardFriendshipLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof NameResolvingError) && !(e instanceof HomeNotConnectedError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* loadFriendGroups(action: NodeCardFriendshipLoadAction, nodeName: string, homeOwnerName: string | null) {
    if (!homeOwnerName || !nodeName || nodeName === homeOwnerName || nodeName.includes(":")) {
        return null;
    }
    const {groups} = yield* call(Node.getFriend, action, ":", nodeName);
    return groups;
}

function* loadRemoteFriendGroups(action: NodeCardFriendshipLoadAction, nodeName: string, homeOwnerName: string | null) {
    if (!homeOwnerName || !nodeName || nodeName === homeOwnerName || homeOwnerName.includes(":")) {
        return null;
    }
    const {groups} = yield* call(Node.getFriend, action, nodeName, homeOwnerName);
    return groups;
}

function* nodeCardBlockingLoadSaga(action: WithContext<NodeCardBlockingLoadAction>) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        const {blocked, blockedBy} = yield* all({
            blocked: call(loadBlocked, action, nodeName, homeOwnerName),
            blockedBy: call(loadBlockedBy, action, nodeName, homeOwnerName)
        });
        yield* put(nodeCardBlockingSet(nodeName, blocked ?? null, blockedBy ?? null).causedBy(action));
    } catch (e) {
        yield* put(nodeCardBlockingLoadFailed(nodeName).causedBy(action));
        if (!(e instanceof NameResolvingError) && !(e instanceof HomeNotConnectedError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* loadBlocked(action: NodeCardBlockingLoadAction, nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName || nodeName.includes(":")) {
        return null;
    }
    return yield* call(Node.searchBlockedUsers, action, ":", {
        nodeName,
        blockedOperations: ["comment" as const, "reaction" as const, "visibility" as const]
    });
}

function* loadBlockedBy(action: NodeCardBlockingLoadAction, nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName || homeOwnerName.includes(":")) {
        return null;
    }
    return yield* call(Node.searchBlockedByUsers, action, ":", {postings: [{nodeName}]});
}

function* nodeCardSheriffListLoadSaga(action: WithContext<NodeCardSheriffListLoadAction>) {
    const {nodeName} = action.payload;

    if (nodeName.search(/[/:]/g) >= 0) {
        // FIXME dirty hack to avoid URLs as node names in the request's URL - this creates a malformed URL and
        // causes CORS error
        return;
    }

    try {
        yield* call(Node.getUserListItem, action, ":", SHERIFF_USER_LIST_HIDE, nodeName, ["user-list-item.not-found"]);
        yield* put(nodeCardSheriffListSet(nodeName, true).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "user-list-item.not-found") {
            yield* put(nodeCardSheriffListSet(nodeName, false).causedBy(action));
        } else {
            yield* put(nodeCardBlockingLoadFailed(nodeName).causedBy(action));
            if (!(e instanceof NameResolvingError) && !(e instanceof HomeNotConnectedError)) {
                yield* put(errorThrown(e));
            }
        }
    }
}

function* nodeCardCopyMention(action: NodeCardCopyMentionAction) {
    yield* call(clipboardCopy, mentionName(action.payload.nodeName, action.payload.fullName));
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("mention-copied")).causedBy(action));
    }
}

function* sheriffListAddSaga(action: SheriffListAddAction) {
    const {nodeName} = action.payload;
    try {
        yield* call(Node.createUserListItem, action, ":", SHERIFF_USER_LIST_HIDE, {nodeName});
        yield* put(nodeCardSheriffListSet(nodeName, true).causedBy(action));
        yield* put(flashBox(i18n.t("content-hidden-in-google-play")).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* sheriffListDeleteSaga(action: SheriffListDeleteAction) {
    const {nodeName} = action.payload;
    try {
        yield* call(Node.deleteUserListItem, action, ":", SHERIFF_USER_LIST_HIDE, nodeName);
        yield* put(nodeCardSheriffListSet(nodeName, false).causedBy(action));
        yield* put(flashBox(i18n.t("content-unhidden-in-google-play")).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

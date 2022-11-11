import { all, call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { NameResolvingError, Node } from "api";
import { executor } from "state/executor";
import { mutuallyIntroduced } from "state/init-selectors";
import {
    NODE_CARD_COPY_MENTION,
    NODE_CARD_DETAILS_LOAD,
    NODE_CARD_FRIENDSHIP_LOAD,
    NODE_CARD_PEOPLE_LOAD,
    NODE_CARD_PREPARE,
    NODE_CARD_STORIES_LOAD,
    NODE_CARD_SUBSCRIPTION_LOAD,
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
    nodeCardStoriesLoad,
    NodeCardStoriesLoadAction,
    nodeCardStoriesSet,
    nodeCardSubscriptionLoad,
    NodeCardSubscriptionLoadAction,
    nodeCardSubscriptionLoadFailed,
    nodeCardSubscriptionSet
} from "state/nodecards/actions";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { flashBox } from "state/flashbox/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { Browser } from "ui/browser";
import { mentionName } from "util/misc";

export default [
    executor(NODE_CARD_PREPARE, payload => payload.nodeName, nodeCardPrepareSaga),
    executor(NODE_CARD_DETAILS_LOAD, payload => payload.nodeName, nodeCardDetailsLoadSaga),
    executor(NODE_CARD_PEOPLE_LOAD, payload => payload.nodeName, nodeCardPeopleLoadSaga),
    executor(NODE_CARD_STORIES_LOAD, payload => payload.nodeName, nodeCardStoriesLoadSaga),
    executor(NODE_CARD_SUBSCRIPTION_LOAD, payload => payload.nodeName, nodeCardSubscriptionLoadSaga),
    executor(NODE_CARD_FRIENDSHIP_LOAD, payload => payload.nodeName, nodeCardFriendshipLoadSaga, mutuallyIntroduced),
    executor(NODE_CARD_COPY_MENTION, "", nodeCardCopyMention)
];

function* nodeCardPrepareSaga(action: NodeCardPrepareAction) {
    const {nodeName} = action.payload;
    const card = yield* select(getNodeCard, nodeName);
    if (card == null || (!card.details.loaded && !card.details.loading)) {
        yield* put(nodeCardDetailsLoad(nodeName));
    }
    if (card == null || (!card.people.loaded && !card.people.loading)) {
        yield* put(nodeCardPeopleLoad(nodeName));
    }
    if (card == null || (!card.stories.loaded && !card.stories.loading)) {
        yield* put(nodeCardStoriesLoad(nodeName));
    }
    if (card == null || (!card.subscription.loaded && !card.subscription.loading)) {
        yield* put(nodeCardSubscriptionLoad(nodeName));
    }
    if (card == null || (!card.friendship.loaded && !card.friendship.loading)) {
        yield* put(nodeCardFriendshipLoad(nodeName));
    }
}

function* nodeCardDetailsLoadSaga(action: NodeCardDetailsLoadAction) {
    const {nodeName} = action.payload;
    try {
        const profile = yield* call(Node.getProfile, nodeName);
        yield* put(nodeCardDetailsSet(nodeName, profile));
    } catch (e) {
        yield* put(nodeCardDetailsLoadFailed(nodeName));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* nodeCardPeopleLoadSaga(action: NodeCardPeopleLoadAction) {
    const {nodeName} = action.payload;
    try {
        const data = yield* call(Node.getPeopleGeneral, nodeName);
        yield* put(nodeCardPeopleSet(nodeName, data.feedSubscribersTotal ?? null, data.feedSubscriptionsTotal ?? null));
    } catch (e) {
        yield* put(nodeCardPeopleLoadFailed(nodeName));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* nodeCardStoriesLoadSaga(action: NodeCardStoriesLoadAction) {
    const {nodeName} = action.payload;
    try {
        const {total, lastCreatedAt = null} = yield* call(Node.getFeedGeneral, nodeName, "timeline");
        yield* put(nodeCardStoriesSet(nodeName, total, lastCreatedAt));
    } catch (e) {
        yield* put(nodeCardDetailsLoadFailed(nodeName));
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
            subscriber: call(loadSubscriber, nodeName, homeOwnerName),
            subscription: call(loadSubscription, nodeName, homeOwnerName)
        });
        yield* put(nodeCardSubscriptionSet(nodeName, subscriber ?? null, subscription ?? null));
    } catch (e) {
        yield* put(nodeCardSubscriptionLoadFailed(nodeName));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* loadSubscriber(nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    const subscribers = yield* call(Node.getSubscribers, ":", "feed" as const, nodeName);
    return subscribers?.[0];
}

function* loadSubscription(nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return null;
    }
    const subscriptions = yield* call(Node.getSubscriptions, ":", "feed" as const, nodeName);
    return subscriptions?.[0];
}

function* nodeCardFriendshipLoadSaga(action: WithContext<NodeCardFriendshipLoadAction>) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        const {groups, remoteGroups} = yield* all({
            groups: call(loadFriendGroups, nodeName, homeOwnerName),
            remoteGroups: call(loadRemoteFriendGroups, nodeName, homeOwnerName)
        });
        yield* put(nodeCardFriendshipSet(nodeName, groups ?? null, remoteGroups ?? null));
    } catch (e) {
        yield* put(nodeCardFriendshipLoadFailed(nodeName));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* loadFriendGroups(nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName || nodeName.includes(":")) {
        return null;
    }
    const {groups} = yield* call(Node.getFriend, ":", nodeName);
    return groups;
}

function* loadRemoteFriendGroups(nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName || homeOwnerName.includes(":")) {
        return null;
    }
    const {groups} = yield* call(Node.getFriend, nodeName, homeOwnerName);
    return groups;
}

function* nodeCardCopyMention(action: NodeCardCopyMentionAction) {
    yield* call(clipboardCopy, mentionName(action.payload.nodeName, action.payload.fullName));
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox(i18n.t("mention-copied")));
    }
}

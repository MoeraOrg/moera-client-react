import { all, call, put } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';

import { NameResolvingError, Node } from "api";
import { executor } from "state/executor";
import {
    NODE_CARD_COPY_MENTION,
    NODE_CARD_LOAD,
    NodeCardCopyMentionAction,
    nodeCardDetailsSet,
    NodeCardLoadAction,
    nodeCardLoaded,
    nodeCardLoadFailed,
    nodeCardPeopleSet,
    nodeCardStoriesSet,
    nodeCardSubscriberSet,
    nodeCardSubscriptionSet
} from "state/nodecards/actions";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { flashBox } from "state/flashbox/actions";
import { Browser } from "ui/browser";
import { mentionName } from "util/misc";

export default [
    executor(NODE_CARD_LOAD, payload => payload.nodeName, nodeCardLoadSaga),
    executor(NODE_CARD_COPY_MENTION, "", nodeCardCopyMention)
];

function* nodeCardLoadSaga(action: WithContext<NodeCardLoadAction>) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        yield* all([
            call(loadDetails, nodeName),
            call(loadPeople, nodeName),
            call(loadStories, nodeName),
            call(loadSubscriber, nodeName, homeOwnerName),
            call(loadSubscription, nodeName, homeOwnerName)
        ]);
        yield* put(nodeCardLoaded(nodeName));
    } catch (e) {
        yield* put(nodeCardLoadFailed(nodeName));
        if (!(e instanceof NameResolvingError)) {
            yield* put(errorThrown(e));
        }
    }
}

function* loadDetails(nodeName: string) {
    const {
        fullName = null, gender = null, title = null, avatar = null, fundraisers = null
    } = yield* call(Node.getProfile, nodeName);
    yield* put(nodeCardDetailsSet(nodeName, fullName, gender, title, avatar, fundraisers));
}

function* loadPeople(nodeName: string) {
    const data = yield* call(Node.getPeopleGeneral, nodeName);
    yield* put(nodeCardPeopleSet(nodeName, data.feedSubscribersTotal ?? null, data.feedSubscriptionsTotal ?? null));
}

function* loadStories(nodeName: string) {
    const {total, lastCreatedAt = null} = yield* call(Node.getFeedGeneral, nodeName, "timeline");
    yield* put(nodeCardStoriesSet(nodeName, total, lastCreatedAt));
}

function* loadSubscriber(nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return;
    }
    const subscribers = yield* call(Node.getSubscribers, ":", "feed" as const, nodeName);
    yield* put(nodeCardSubscriberSet(nodeName, subscribers?.[0]));
}

function* loadSubscription(nodeName: string, homeOwnerName: string | null) {
    if (homeOwnerName == null || nodeName === homeOwnerName) {
        return;
    }
    const subscriptions = yield* call(Node.getSubscriptions, ":", "feed" as const, nodeName);
    yield* put(nodeCardSubscriptionSet(nodeName, subscriptions?.[0]));
}

function* nodeCardCopyMention(action: NodeCardCopyMentionAction) {
    yield* call(clipboardCopy, mentionName(action.payload.nodeName, action.payload.fullName));
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Mention copied to the clipboard"));
    }
}

import { all, call, put } from 'typed-redux-saga/macro';

import { executor } from "state/executor";
import { NameResolvingError, Node } from "api";
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
    nodeCardSubscriptionSet
} from "state/nodecards/actions";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import clipboardCopy from "clipboard-copy";
import { Browser } from "ui/browser";
import { flashBox } from "state/flashbox/actions";
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
            call(loadStoriesAndSubscription, nodeName, homeOwnerName)
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
    yield* put(nodeCardPeopleSet(nodeName, data.feedSubscribersTotal, data.feedSubscriptionsTotal));
}

function* loadStoriesAndSubscription(nodeName: string, homeOwnerName: string | null) {
    const {total, lastCreatedAt = null, subscriberId = null} = yield* call(Node.getFeedGeneral, nodeName, "timeline");
    yield* put(nodeCardStoriesSet(nodeName, total, lastCreatedAt));
    if (nodeName !== homeOwnerName) {
        yield* put(nodeCardSubscriptionSet(nodeName, subscriberId));
    }
}

function* nodeCardCopyMention(action: NodeCardCopyMentionAction) {
    yield* call(clipboardCopy, mentionName(action.payload.nodeName, action.payload.fullName));
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Mention copied to the clipboard"));
    }
}

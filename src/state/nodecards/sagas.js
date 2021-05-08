import { all, call, put } from 'redux-saga/effects';

import { executor } from "state/executor";
import { NameResolvingError, Node } from "api";
import {
    NODE_CARD_COPY_MENTION,
    NODE_CARD_LOAD,
    nodeCardDetailsSet,
    nodeCardLoaded,
    nodeCardLoadFailed,
    nodeCardPeopleSet,
    nodeCardSubscriptionSet
} from "state/nodecards/actions";
import { errorThrown } from "state/error/actions";
import clipboardCopy from "clipboard-copy";
import { Browser } from "ui/browser";
import { flashBox } from "state/flashbox/actions";
import { mentionName } from "util/misc";

export default [
    executor(NODE_CARD_LOAD, payload => payload.nodeName, nodeCardLoadSaga),
    executor(NODE_CARD_COPY_MENTION, "", nodeCardCopyMention)
];

function* nodeCardLoadSaga(action) {
    const {nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        yield all([
            call(loadDetails, nodeName),
            call(loadPeople, nodeName),
            call(loadSubscription, nodeName, homeOwnerName)
        ]);
        yield put(nodeCardLoaded(nodeName));
    } catch (e) {
        yield put(nodeCardLoadFailed(nodeName));
        if (!(e instanceof NameResolvingError)) {
            yield put(errorThrown(e));
        }
    }
}

function* loadDetails(nodeName) {
    const data = yield call(Node.getWhoAmI, nodeName);
    yield put(nodeCardDetailsSet(nodeName, data.fullName, data.gender, data.title, data.avatar));
}

function* loadPeople(nodeName) {
    const data = yield call(Node.getPeopleGeneral, nodeName);
    yield put(nodeCardPeopleSet(nodeName, data.feedSubscribersTotal, data.feedSubscriptionsTotal));
}

function* loadSubscription(nodeName, homeOwnerName) {
    if (nodeName === homeOwnerName) {
        return;
    }
    const data = yield call(Node.getFeedGeneral, nodeName, "timeline");
    yield put(nodeCardSubscriptionSet(nodeName, data.subscriberId));
}

function* nodeCardCopyMention(action) {
    yield call(clipboardCopy, mentionName(action.payload.nodeName, action.payload.fullName));
    if (Browser.userAgentOs !== "android") {
        yield put(flashBox("Mention copied to the clipboard"));
    }
}

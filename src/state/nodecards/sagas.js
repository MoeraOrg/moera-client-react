import { all, call, put, select } from 'redux-saga/effects';

import { executor } from "state/executor";
import { Node } from "api";
import {
    NODE_CARD_LOAD,
    nodeCardLoaded,
    nodeCardLoadFailed,
    nodeCardPeopleSet,
    nodeCardSubscriptionSet
} from "state/nodecards/actions";
import { errorThrown } from "state/error/actions";
import { getHomeOwnerName } from "state/home/selectors";

export default [
    executor(NODE_CARD_LOAD, payload => payload.nodeName, nodeCardLoadSaga)
];

function* nodeCardLoadSaga(action) {
    const {nodeName} = action.payload;
    try {
        yield all([
            call(loadPeople, nodeName),
            call(loadSubscription, nodeName)
        ]);
        yield put(nodeCardLoaded(nodeName));
    } catch (e) {
        yield put(nodeCardLoadFailed(nodeName));
        yield put(errorThrown(e));
    }
}

function* loadPeople(nodeName) {
    const data = yield call(Node.getPeopleGeneral, nodeName);
    yield put(nodeCardPeopleSet(nodeName, data.feedSubscribersTotal, data.feedSubscriptionsTotal));
}

function* loadSubscription(nodeName) {
    const homeOwnerName = yield select(getHomeOwnerName);
    if (nodeName === homeOwnerName) {
        return;
    }
    const data = yield call(Node.getFeedGeneral, nodeName, "timeline");
    yield put(nodeCardSubscriptionSet(nodeName, data.subscriberId));
}

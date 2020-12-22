import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    feedFutureSliceLoadFailed,
    feedFutureSliceSet,
    feedGeneralLoadFailed,
    feedGeneralSet,
    feedPastSliceLoadFailed,
    feedPastSliceSet,
    feedSliceUpdate,
    feedStatusLoadFailed,
    feedStatusSet,
    feedStatusUpdated,
    feedStatusUpdateFailed,
    feedSubscribed,
    feedSubscribeFailed,
    feedUnsubscribed,
    feedUnsubscribeFailed
} from "state/feeds/actions";
import { errorThrown } from "state/error/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { getOwnerName } from "state/owner/selectors";
import { fillActivityReactions } from "state/activityreactions/sagas";
import { fillSubscriptions } from "state/subscriptions/sagas";

export function* feedGeneralLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const data = yield call(Node.getFeedGeneral, "", feedName);
        yield put(feedGeneralSet(feedName, data));
    } catch (e) {
        yield put(feedGeneralLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedSubscribeSaga(action) {
    const {nodeName, feedName} = action.payload;
    const ownerName = yield select(getOwnerName);
    try {
        const data = yield call(Node.postFeedSubscriber, nodeName, feedName);
        yield call(Node.postFeedSubscription, ":", data.id, nodeName ? nodeName : ownerName, feedName);
        yield put(feedSubscribed(nodeName, feedName, data.id));
    } catch (e) {
        yield put(feedSubscribeFailed(nodeName, feedName));
        yield put(errorThrown(e));
    }
}

export function* feedUnsubscribeSaga(action) {
    const {nodeName, feedName, subscriberId} = action.payload;
    const ownerName = yield select(getOwnerName);
    try {
        yield call(Node.deleteSubscriber, nodeName, subscriberId);
        yield call(Node.deleteSubscription, ":", subscriberId, nodeName ? nodeName : ownerName);
        yield put(feedUnsubscribed(nodeName, feedName));
    } catch (e) {
        yield put(feedUnsubscribeFailed(nodeName, feedName));
        yield put(errorThrown(e));
    }
}

export function* feedStatusLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const data = yield call(Node.getFeedStatus, ":", feedName.substring(1)); // feedName must start with ":"
        yield put(feedStatusSet(feedName, data));
    } catch (e) {
        yield put(feedStatusLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedStatusUpdateSaga(action) {
    const {feedName, viewed, read, before} = action.payload;
    try {
        yield put(feedStatusUpdated(feedName, viewed, read, before));
        // feedName must start with ":"
        const data = yield call(Node.putFeedStatus, ":", feedName.substring(1), viewed, read, before);
        yield put(feedStatusSet(feedName, data));
    } catch (e) {
        yield put(feedStatusUpdateFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedPastSliceLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const before = (yield select(state => getFeedState(state, feedName))).after;
        const data = feedName.startsWith(":")
            ? yield call(Node.getFeedSlice, ":", feedName.substring(1), null, before, 20)
            : yield call(Node.getFeedSlice, "", feedName, null, before, 20);
        yield call(fillActivityReactions, data.stories);
        yield call(fillSubscriptions, data.stories);
        yield put(feedPastSliceSet(feedName, data.stories, data.before, data.after));
    } catch (e) {
        yield put(feedPastSliceLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedFutureSliceLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const after = (yield select(state => getFeedState(state, feedName))).before;
        const data = feedName.startsWith(":")
            ? yield call(Node.getFeedSlice, ":", feedName.substring(1), after, null, 20)
            : yield call(Node.getFeedSlice, "", feedName, after, null, 20);
        yield call(fillActivityReactions, data.stories);
        yield call(fillSubscriptions, data.stories);
        yield put(feedFutureSliceSet(feedName, data.stories, data.before, data.after));
    } catch (e) {
        yield put(feedFutureSliceLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedsUpdateSaga() {
    const feedNames = yield select(getAllFeeds);
    for (const feedName of feedNames) {
        try {
            let {before, after} = yield select(state => getFeedState(state, feedName));
            while (before > after) {
                const data = feedName.startsWith(":")
                    ? yield call(Node.getFeedSlice, ":", feedName.substring(1), after, null, 20)
                    : yield call(Node.getFeedSlice, "", feedName, after, null, 20);
                yield call(fillActivityReactions, data.stories);
                yield call(fillSubscriptions, data.stories);
                yield put(feedSliceUpdate(feedName, data.stories, data.before, data.after));
                after = data.before;
            }
        } catch (e) {
            yield put(errorThrown(e));
        }
    }
}

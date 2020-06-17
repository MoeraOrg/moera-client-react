import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    feedFutureSliceLoadFailed,
    feedFutureSliceSet,
    feedGeneralLoadFailed,
    feedGeneralSet,
    feedPastSliceLoadFailed,
    feedPastSliceSet,
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
import { namingNameUsed } from "state/naming/actions";
import { getFeedState, getFeedSubscriberId } from "state/feeds/selectors";
import { getOwnerName } from "state/owner/selectors";
import { fillActivityReactions } from "state/activityreactions/sagas";

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
    const {feedName} = action.payload;
    const ownerName = yield select(getOwnerName)
    try {
        const data = yield call(Node.postSubscriber, "", feedName);
        yield call(Node.postSubscription, ":", data.id, ownerName, feedName);
        yield put(feedSubscribed(feedName, data.id));
    } catch (e) {
        yield put(feedSubscribeFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedUnsubscribeSaga(action) {
    const {feedName} = action.payload;
    const {subscriberId, ownerName} = yield select(state => ({
        subscriberId: getFeedSubscriberId(state, feedName),
        ownerName: getOwnerName(state)
    }));
    try {
        yield call(Node.deleteSubscriber, "", subscriberId);
        yield call(Node.deleteSubscription, ":", subscriberId, ownerName);
        yield put(feedUnsubscribed(feedName));
    } catch (e) {
        yield put(feedUnsubscribeFailed(feedName));
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
        yield put(feedPastSliceSet(feedName, data.stories, data.before, data.after));
        yield call(cacheNames, data.stories);
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
        yield put(feedFutureSliceSet(feedName, data.stories, data.before, data.after));
        yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(feedFutureSliceLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

function* cacheNames(stories) {
    if (!stories) {
        return;
    }
    const usedNames = new Set();
    stories
        .filter(s => s.posting != null && s.posting.ownerName != null)
        .forEach(s => usedNames.add(s.posting.ownerName));
    stories
        .filter(s => s.posting != null && s.posting.receiverName != null)
        .forEach(s => usedNames.add(s.posting.receiverName));
    for (let name of usedNames) {
        yield put(namingNameUsed(name));
    }
}

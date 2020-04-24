import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    feedFutureSliceLoadFailed,
    feedFutureSliceSet,
    feedGeneralLoadFailed,
    feedGeneralSet,
    feedPastSliceLoadFailed,
    feedPastSliceSet
} from "state/feeds/actions";
import { errorThrown } from "state/error/actions";
import { namingNameUsed } from "state/naming/actions";
import { getFeedState } from "state/feeds/selectors";

export function* feedGeneralLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const data = yield call(Node.getFeedGeneral, feedName);
        yield put(feedGeneralSet(feedName, data));
    } catch (e) {
        yield put(feedGeneralLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

export function* feedPastSliceLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const before = (yield select(state => getFeedState(state, feedName))).after;
        const data = yield call(Node.getFeedSlice, feedName, null, before, 20);
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
        const data = yield call(Node.getFeedSlice, feedName, after, null, 20);
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
    stories.filter(s => s.posting != null).forEach(s => {
        usedNames.add(s.posting.ownerName);
        usedNames.add(s.posting.receiverName);
    });
    for (let name of usedNames) {
        yield put(namingNameUsed(name));
    }
}

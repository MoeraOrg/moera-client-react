import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    timelineFutureSliceLoadFailed,
    timelineFutureSliceSet,
    timelineGeneralLoadFailed,
    timelineGeneralSet,
    timelinePastSliceLoadFailed,
    timelinePastSliceSet
} from "state/timeline/actions";
import { errorThrown } from "state/error/actions";
import { namingNameUsed } from "state/naming/actions";

export function* timelineGeneralLoadSaga() {
    try {
        const data = yield call(Node.getTimelineGeneral);
        yield put(timelineGeneralSet(data));
    } catch (e) {
        yield put(timelineGeneralLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* timelinePastSliceLoadSaga() {
    try {
        const before = yield select(state => state.timeline.after);
        const data = yield call(Node.getTimelineSlice, null, before, 20);
        yield put(timelinePastSliceSet(data.stories, data.before, data.after));
        yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(timelinePastSliceLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* timelineFutureSliceLoadSaga() {
    try {
        const after = yield select(state => state.timeline.before);
        const data = yield call(Node.getTimelineSlice, after, null, 20);
        yield put(timelineFutureSliceSet(data.stories, data.before, data.after));
        yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(timelineFutureSliceLoadFailed());
        yield put(errorThrown(e));
    }
}

function* cacheNames(stories) {
    if (!stories) {
        return;
    }
    const usedNames = new Set();
    stories.forEach(s => {
        usedNames.add(s.posting.ownerName);
        usedNames.add(s.posting.receiverName);
    });
    for (let name of usedNames) {
        yield put(namingNameUsed(name));
    }
}

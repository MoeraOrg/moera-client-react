import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    commentPostFailed,
    commentPostSucceeded,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    detailedPostingLoaded,
    detailedPostingLoadFailed
} from "state/detailedposting/actions";
import { getCommentsState, getDetailedPostingId } from "state/detailedposting/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";

export function* detailedPostingLoadSaga() {
    try {
        const id = yield select(getDetailedPostingId);
        const data = yield call(Node.getPosting, "", id);
        yield call(fillActivityReaction, data)
        yield put(detailedPostingLoaded(data));
    } catch (e) {
        yield put(detailedPostingLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* commentsPastSliceLoadSaga() {
    const {postingId, before} = (yield select(state => ({
        postingId: getDetailedPostingId(state),
        before: getCommentsState(state).after
    })));
    try {
        const data = yield call(Node.getCommentsSlice, "", postingId, null, before, 20);
        yield put(commentsPastSliceSet(postingId, data.comments, data.before, data.after));
        // yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(commentsPastSliceLoadFailed(postingId));
        yield put(errorThrown(e));
    }
}

export function* commentsFutureSliceLoadSaga() {
    const {postingId, after} = (yield select(state => ({
        postingId: getDetailedPostingId(state),
        after: getCommentsState(state).before
    })));
    try {
        const data = yield call(Node.getCommentsSlice, "", postingId, after, null, 20);
        yield put(commentsFutureSliceSet(postingId, data.comments, data.before, data.after));
        // yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(commentsFutureSliceLoadFailed(postingId));
        yield put(errorThrown(e));
    }
}

export function* commentPostSaga(action) {
    const {id, postingId, commentText} = action.payload;

    try {
        let data;
        if (id == null) {
            data = yield call(Node.postComment, "", postingId, commentText);
            yield put(commentPostSucceeded(data.comment, data.total));
        } else {
            data = yield call(Node.putComment, "", postingId, id, commentText);
            yield put(commentPostSucceeded(data, null));
        }
    } catch (e) {
        yield put(commentPostFailed(postingId));
        yield put(errorThrown(e));
    }
}

import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    commentPosted,
    commentPostFailed,
    commentSet,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    commentsReceiverSwitched,
    detailedPostingLoaded,
    detailedPostingLoadFailed
} from "state/detailedposting/actions";
import { getCommentsState, getDetailedPosting, getDetailedPostingId } from "state/detailedposting/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { postingCommentsSet } from "state/postings/actions";
import { getOwnerName } from "state/owner/selectors";

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

export function* commentsReceiverSwitchSaga() {
    const {ownerName, posting} = yield select(state => ({
        ownerName: getOwnerName(state),
        posting: getDetailedPosting(state)
    }));
    const receiverName = posting.receiverName ?? ownerName;
    const receiverPostingId = posting.receiverPostingId ?? posting.id;
    yield put(commentsReceiverSwitched(receiverName, receiverPostingId));
}

export function* commentsPastSliceLoadSaga() {
    const {receiverName, receiverPostingId, after} = yield select(getCommentsState);
    try {
        const data = yield call(Node.getCommentsSlice, receiverName, receiverPostingId, null, after, 20);
        yield put(commentsPastSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after));
        // yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(commentsPastSliceLoadFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}

export function* commentsFutureSliceLoadSaga() {
    const {receiverName, receiverPostingId, before} = yield select(getCommentsState);
    try {
        const data = yield call(Node.getCommentsSlice, receiverName, receiverPostingId, before, null, 20);
        yield put(commentsFutureSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after));
        // yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(commentsFutureSliceLoadFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}

export function* commentPostSaga(action) {
    const {id, postingId, commentText} = action.payload;

    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        let comment;
        if (id == null) {
            const data = yield call(Node.postComment, receiverName, receiverPostingId, commentText);
            yield put(postingCommentsSet(postingId, data.total));
            comment = data.comment;
        } else {
            comment = yield call(Node.putComment, receiverName, receiverPostingId, id, commentText);
        }
        yield put(commentSet(receiverName, comment));
        yield put(commentPosted(receiverName, receiverPostingId));
        yield call(Node.putRemoteComment, ":", receiverName, receiverPostingId, comment.id, commentText);
    } catch (e) {
        yield put(commentPostFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}

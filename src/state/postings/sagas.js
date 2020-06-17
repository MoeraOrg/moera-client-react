import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    postingDeleted,
    postingDeleteFailed,
    postingLoadFailed,
    postingReactionSet,
    postingSet,
    postingVerifyFailed
} from "state/postings/actions";
import { getPosting } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";
import { isAtHomeNode } from "state/node/selectors";

export function* postingDeleteSaga(action) {
    const id = action.payload.id;
    const posting = yield select(getPosting, id);
    try {
        yield call(Node.deletePosting, "", id);
        yield put(postingDeleted(posting.id, posting.feedReferences));
    } catch (e) {
        yield put(postingDeleteFailed(id));
        yield put(errorThrown(e));
    }
}

export function* postingLoadSaga(action) {
    try {
        const data = yield call(Node.getPosting, "", action.payload.id);
        yield put(postingSet(data));
    } catch (e) {
        yield put(postingLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* postingVerifySaga(action) {
    const ownerName = yield select(getOwnerName);
    try {
        yield call(Node.remotePostingVerify, ":", ownerName, action.payload.id);
    } catch (e) {
        yield put(postingVerifyFailed());
        yield put(errorThrown(e));
    }
}

export function* postingReactSaga(action) {
    const {id, negative, emoji} = action.payload;
    try {
        const data = yield call(Node.postReaction, "", id, negative, emoji);
        yield put(postingReactionSet(id, {negative, emoji}, data.totals));
        const ownerName = yield select(getOwnerName);
        yield call(Node.postRemoteReaction, ":", ownerName, id, negative, emoji);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* postingReactionLoadSaga(action) {
    const {id} = action.payload;
    try {
        const {negative, emoji} = yield call(Node.getReaction, "", id);
        const totals = yield call(Node.getReactionTotals, "", id);
        yield put(postingReactionSet(id, {negative, emoji}, totals));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* postingReactionDeleteSaga(action) {
    const {id} = action.payload;
    try {
        const data = yield call(Node.deleteReaction, "", id);
        yield put(postingReactionSet(id, null, data));
        const {atHome, ownerName} = yield select(state => ({
            atHome: isAtHomeNode(state),
            ownerName: getOwnerName(state)
        }));
        if (!atHome) {
            yield call(Node.deleteRemoteReaction, ":", ownerName, id);
        }
    } catch (e) {
        yield put(errorThrown(e));
    }
}

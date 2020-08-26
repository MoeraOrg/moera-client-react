import { call, put, select } from 'redux-saga/effects';
import clipboardCopy from 'clipboard-copy';

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
import { fillActivityReaction } from "state/activityreactions/sagas";
import { getNodeUri } from "state/naming/sagas";
import { flashBox } from "state/flashbox/actions";

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
        yield call(fillActivityReaction, data)
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
        const data = yield call(Node.postPostingReaction, "", id, negative, emoji);
        yield put(postingReactionSet(id, {negative, emoji}, data.totals));
        const {ownerName, posting} = yield select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        yield call(Node.postRemotePostingReaction, ":", posting.receiverName ?? ownerName,
            posting.receiverPostingId ?? id, negative, emoji);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* postingReactionLoadSaga(action) {
    const {id} = action.payload;
    try {
        const {negative, emoji} = yield call(Node.getPostingReaction, "", id);
        const totals = yield call(Node.getPostingReactionTotals, "", id);
        yield put(postingReactionSet(id, {negative, emoji}, totals));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* postingReactionDeleteSaga(action) {
    const {id} = action.payload;
    try {
        let data = yield call(Node.deletePostingReaction, "", id);
        const {ownerName, posting} = yield select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        if (posting.receiverName != null) {
            data = yield call(Node.deletePostingReaction, posting.receiverName, posting.receiverPostingId);
        }
        yield put(postingReactionSet(id, null, data));
        yield call(Node.deleteRemotePostingReaction, ":", posting.receiverName ?? ownerName,
            posting.receiverPostingId ?? id);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* postingGetLink(id) {
    const posting = yield select(getPosting, id);
    if (posting.receiverName == null) {
        const rootLocation = yield select(state => state.node.root.location);
        return `${rootLocation}/moera/post/${id}`;
    } else {
        const nodeUri = yield call(getNodeUri, posting.receiverName);
        return `${nodeUri}/post/${posting.receiverPostingId}`;
    }
}

export function* postingCopyLinkSaga(action) {
    const {id} = action.payload;
    try {
        const href = yield call(postingGetLink, id);
        yield call(clipboardCopy, href);
        yield put(flashBox("Link copied to the clipboard"));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    reactionsDialogPastReactionsLoaded,
    reactionsDialogPastReactionsLoadFailed,
    reactionsDialogTotalsLoaded,
    reactionsDialogTotalsLoadFailed,
    reactionVerifyFailed
} from "state/reactionsdialog/actions";
import { errorThrown } from "state/error/actions";
import { getOwnerName } from "state/owner/selectors";
import { getPosting } from "state/postings/selectors";

export function* reactionsDialogPastReactionsLoadSaga() {
    const {posting, negative, before, emoji} = yield select(state => ({
        posting: getPosting(state, state.reactionsDialog.postingId),
        negative: state.reactionsDialog.negative,
        before: state.reactionsDialog.reactions.after,
        emoji: state.reactionsDialog.activeTab
    }));
    const nodeName = posting.receiverName ?? "";
    const postingId = posting.receiverPostingId ?? posting.id;
    try {
        const data = yield call(Node.getPostingReactions, nodeName, postingId, negative, emoji, before, 40);
        yield put(reactionsDialogPastReactionsLoaded(
            data.reactions, posting.id, negative, emoji, data.before, data.after, data.total));
        // TODO extract node names and put them into naming cache queue
    } catch (e) {
        yield put(reactionsDialogPastReactionsLoadFailed(posting.id, negative, emoji));
        yield put(errorThrown(e));
    }
}

export function* reactionsDialogTotalsLoadSaga() {
    try {
        const postingId = yield select(state => state.reactionsDialog.postingId);
        const data = yield call(Node.getPostingReactionTotals, "", postingId);
        yield put(reactionsDialogTotalsLoaded(data.positive, data.negative));
    } catch (e) {
        yield put(reactionsDialogTotalsLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* reactionVerifySaga(action) {
    const nodeName = yield select(getOwnerName);
    try {
        yield call(Node.remotePostingReactionVerify, ":", nodeName, action.payload.postingId,
            action.payload.ownerName);
    } catch (e) {
        yield put(reactionVerifyFailed());
        yield put(errorThrown(e));
    }
}

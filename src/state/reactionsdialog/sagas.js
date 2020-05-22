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

export function* reactionsDialogPastReactionsLoadSaga() {
    const {postingId, negative, before, emoji} = yield select(state => ({
        postingId: state.reactionsDialog.postingId,
        negative: state.reactionsDialog.negative,
        before: state.reactionsDialog.reactions.after,
        emoji: state.reactionsDialog.activeTab
    }));
    try {
        const data = yield call(Node.getReactions, "", postingId, negative, emoji, before, 40);
        yield put(reactionsDialogPastReactionsLoaded(
            data.reactions, postingId, negative, emoji, data.before, data.after, data.total));
        // TODO extract node names and put them into naming cache queue
    } catch (e) {
        yield put(reactionsDialogPastReactionsLoadFailed(postingId, negative, emoji));
        yield put(errorThrown(e));
    }
}

export function* reactionsDialogTotalsLoadSaga() {
    try {
        const postingId = yield select(state => state.reactionsDialog.postingId);
        const data = yield call(Node.getReactionTotals, "", postingId);
        yield put(reactionsDialogTotalsLoaded(data.positive, data.negative));
    } catch (e) {
        yield put(reactionsDialogTotalsLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* reactionVerifySaga(action) {
    const nodeName = yield select(getOwnerName);
    try {
        yield call(Node.remoteReactionVerify, ":", nodeName, action.payload.postingId, action.payload.ownerName);
    } catch (e) {
        yield put(reactionVerifyFailed());
        yield put(errorThrown(e));
    }
}

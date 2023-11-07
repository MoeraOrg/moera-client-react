import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import {
    reactionsDialogPastReactionsLoaded,
    reactionsDialogPastReactionsLoadFailed,
    reactionsDialogTotalsLoaded,
    reactionsDialogTotalsLoadFailed,
    ReactionVerifyAction,
    reactionVerifyFailed
} from "state/reactionsdialog/actions";
import { errorThrown } from "state/error/actions";
import { getPosting } from "state/postings/selectors";
import { executor } from "state/executor";
import { WithContext } from "state/action-types";

export default [
    executor("REACTIONS_DIALOG_PAST_REACTIONS_LOAD", "", reactionsDialogPastReactionsLoadSaga),
    executor("REACTIONS_DIALOG_TOTALS_LOAD", "", reactionsDialogTotalsLoadSaga),
    executor(
        "REACTION_VERIFY",
        payload => `${payload.postingId}:${payload.commentId}:${payload.ownerName}`,
        reactionVerifySaga
    )
];

function* reactionsDialogPastReactionsLoadSaga() {
    const {nodeName, posting, commentId, negative, before, emoji} = yield* select(state => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getPosting(state, state.reactionsDialog.postingId),
        commentId: state.reactionsDialog.commentId,
        negative: state.reactionsDialog.negative,
        before: state.reactionsDialog.reactions[state.reactionsDialog.activeTab ?? 0].after,
        emoji: state.reactionsDialog.activeTab
    }));
    if (posting == null) {
        return;
    }
    const postingId = posting.receiverPostingId ?? posting.id;
    try {
        const slice = commentId == null
            ? yield* call(Node.getPostingReactionsSlice, nodeName, postingId, negative, emoji, before, 40)
            : yield* call(Node.getCommentReactionsSlice, nodeName, postingId, commentId, negative, emoji, before, 40);
        yield* put(reactionsDialogPastReactionsLoaded(
            slice.reactions, posting.id, commentId, negative, emoji, slice.before, slice.after, slice.total));
    } catch (e) {
        yield* put(reactionsDialogPastReactionsLoadFailed(posting.id, null, negative, emoji));
        yield* put(errorThrown(e));
    }
}

function* reactionsDialogTotalsLoadSaga() {
    const {nodeName, posting, commentId} = yield* select(state => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getPosting(state, state.reactionsDialog.postingId),
        commentId: state.reactionsDialog.commentId
    }));
    if (posting == null) {
        return;
    }
    const postingId = posting.receiverPostingId ?? posting.id;
    try {
        const totals = commentId == null
            ? yield* call(Node.getPostingReactionTotals, "", posting.id)
            : yield* call(Node.getCommentReactionTotals, nodeName, postingId, commentId)
        yield* put(reactionsDialogTotalsLoaded(totals.positive, totals.negative));
    } catch (e) {
        yield* put(reactionsDialogTotalsLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* reactionVerifySaga(action: WithContext<ReactionVerifyAction>) {
    const {postingId, commentId, ownerName} = action.payload;
    const nodeName = action.context.ownerName;
    if (nodeName == null) {
        yield* put(reactionVerifyFailed(postingId, commentId, ownerName));
        return;
    }
    try {
        if (commentId == null) {
            yield* call(Node.verifyRemotePostingReaction, ":", nodeName, postingId, ownerName);
        } else {
            yield* call(Node.verifyRemoteCommentReaction, ":", nodeName, postingId, commentId, ownerName);
        }
    } catch (e) {
        yield* put(reactionVerifyFailed(postingId, commentId, ownerName));
        yield* put(errorThrown(e));
    }
}

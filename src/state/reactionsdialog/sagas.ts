import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import {
    ReactionsDialogPastReactionsLoadAction,
    reactionsDialogPastReactionsLoaded,
    reactionsDialogPastReactionsLoadFailed,
    ReactionsDialogTotalsLoadAction,
    reactionsDialogTotalsLoaded,
    reactionsDialogTotalsLoadFailed,
    ReactionVerifyAction,
    reactionVerifyFailed
} from "state/reactionsdialog/actions";
import { errorThrown } from "state/error/actions";
import { getPosting } from "state/postings/selectors";
import { executor } from "state/executor";

export default [
    executor("REACTIONS_DIALOG_PAST_REACTIONS_LOAD", "", reactionsDialogPastReactionsLoadSaga),
    executor("REACTIONS_DIALOG_TOTALS_LOAD", "", reactionsDialogTotalsLoadSaga),
    executor(
        "REACTION_VERIFY",
        payload => `${payload.postingId}:${payload.commentId}:${payload.ownerName}`,
        reactionVerifySaga
    )
];

function* reactionsDialogPastReactionsLoadSaga(action: ReactionsDialogPastReactionsLoadAction) {
    const {nodeName, posting, commentId, negative, before, emoji} = yield* select((state: ClientState) => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getPosting(state, state.reactionsDialog.postingId),
        commentId: state.reactionsDialog.commentId,
        negative: state.reactionsDialog.negative,
        before: state.reactionsDialog.reactions[state.reactionsDialog.activeTab ?? 0]?.after,
        emoji: state.reactionsDialog.activeTab
    }));
    if (posting == null) {
        return;
    }
    const postingId = posting.receiverPostingId ?? posting.id;
    try {
        const slice = commentId == null
            ? yield* call(Node.getPostingReactionsSlice, action, nodeName, postingId, negative, emoji, before, 40)
            : yield* call(Node.getCommentReactionsSlice, action, nodeName, postingId, commentId, negative, emoji,
                before, 40);
        yield* put(reactionsDialogPastReactionsLoaded(
            slice.reactions, posting.id, commentId, negative, emoji, slice.before, slice.after, slice.total
        ).causedBy(action));
    } catch (e) {
        yield* put(reactionsDialogPastReactionsLoadFailed(posting.id, null, negative, emoji).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* reactionsDialogTotalsLoadSaga(action: ReactionsDialogTotalsLoadAction) {
    const {nodeName, posting, commentId} = yield* select((state: ClientState) => ({
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
            ? yield* call(Node.getPostingReactionTotals, action, "", posting.id)
            : yield* call(Node.getCommentReactionTotals, action, nodeName, postingId, commentId)
        yield* put(reactionsDialogTotalsLoaded(totals.positive, totals.negative).causedBy(action));
    } catch (e) {
        yield* put(reactionsDialogTotalsLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* reactionVerifySaga(action: WithContext<ReactionVerifyAction>) {
    const {postingId, commentId, ownerName} = action.payload;
    const nodeName = action.context.ownerName;
    if (nodeName == null) {
        yield* put(reactionVerifyFailed(postingId, commentId, ownerName).causedBy(action));
        return;
    }
    try {
        if (commentId == null) {
            yield* call(Node.verifyRemotePostingReaction, action, ":", nodeName, postingId, ownerName);
        } else {
            yield* call(Node.verifyRemoteCommentReaction, action, ":", nodeName, postingId, commentId, ownerName);
        }
    } catch (e) {
        yield* put(reactionVerifyFailed(postingId, commentId, ownerName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

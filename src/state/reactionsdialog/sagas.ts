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
import { executor } from "state/executor";
import { REL_HOME } from "util/rel-node-name";
import { getReactionsDialogPosting } from "state/reactionsdialog/selectors";

export default [
    executor("REACTIONS_DIALOG_PAST_REACTIONS_LOAD", "", reactionsDialogPastReactionsLoadSaga),
    executor("REACTIONS_DIALOG_TOTALS_LOAD", "", reactionsDialogTotalsLoadSaga),
    executor(
        "REACTION_VERIFY",
        payload => `${payload.postingId}:${payload.commentId}:${payload.ownerName}`,
        reactionVerifySaga
    )
];

function* reactionsDialogPastReactionsLoadSaga(action: WithContext<ReactionsDialogPastReactionsLoadAction>) {
    const {nodeName, posting, commentId, negative, before, emoji} = yield* select((state: ClientState) => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getReactionsDialogPosting(state),
        commentId: state.reactionsDialog.commentId,
        negative: state.reactionsDialog.negative,
        before: state.reactionsDialog.reactions[state.reactionsDialog.activeTab ?? 0]?.after,
        emoji: state.reactionsDialog.activeTab
    }));
    if (nodeName == null || posting == null) {
        return;
    }
    const rNodeName = posting.receiverName ?? nodeName;
    const rPostingId = posting.receiverPostingId ?? posting.id;
    try {
        const slice = commentId == null
            ? yield* call(Node.getPostingReactionsSlice, action, rNodeName, rPostingId, negative, emoji, before, 40)
            : yield* call(Node.getCommentReactionsSlice, action, rNodeName, rPostingId, commentId, negative, emoji,
                before, 40);
        yield* put(reactionsDialogPastReactionsLoaded(
            slice.reactions, posting.id, commentId, negative, emoji, slice.before, slice.after, slice.total
        ).causedBy(action));
    } catch (e) {
        yield* put(reactionsDialogPastReactionsLoadFailed(posting.id, null, negative, emoji).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* reactionsDialogTotalsLoadSaga(action: WithContext<ReactionsDialogTotalsLoadAction>) {
    const {nodeName, posting, commentId} = yield* select((state: ClientState) => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getReactionsDialogPosting(state),
        commentId: state.reactionsDialog.commentId
    }));
    if (nodeName == null || posting == null) {
        return;
    }
    const rNodeName = posting.receiverName ?? nodeName;
    const rPostingId = posting.receiverPostingId ?? posting.id;
    try {
        const totals = commentId == null
            ? yield* call(Node.getPostingReactionTotals, action, rNodeName, rPostingId)
            : yield* call(Node.getCommentReactionTotals, action, rNodeName, rPostingId, commentId)
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
            yield* call(Node.verifyRemotePostingReaction, action, REL_HOME, nodeName, postingId, ownerName);
        } else {
            yield* call(Node.verifyRemoteCommentReaction, action, REL_HOME, nodeName, postingId, commentId, ownerName);
        }
    } catch (e) {
        yield* put(reactionVerifyFailed(postingId, commentId, ownerName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

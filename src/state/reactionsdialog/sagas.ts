import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { executor } from "state/executor";
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
import { getReactionsDialogPosting } from "state/reactionsdialog/selectors";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("REACTIONS_DIALOG_PAST_REACTIONS_LOAD", "", reactionsDialogPastReactionsLoadSaga),
    executor("REACTIONS_DIALOG_TOTALS_LOAD", "", reactionsDialogTotalsLoadSaga),
    executor(
        "REACTION_VERIFY",
        payload => `${payload.postingId}:${payload.commentId}:${payload.ownerName}`,
        reactionVerifySaga
    )
];

async function reactionsDialogPastReactionsLoadSaga(
    action: WithContext<ReactionsDialogPastReactionsLoadAction>
): Promise<void> {
    const {nodeName, posting, commentId, negative, before, emoji} = select(state => ({
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
            ? await Node.getPostingReactionsSlice(action, rNodeName, rPostingId, negative, emoji, before, 40)
            : await Node.getCommentReactionsSlice(action, rNodeName, rPostingId, commentId, negative, emoji, before, 40);
        dispatch(reactionsDialogPastReactionsLoaded(
            slice.reactions, posting.id, commentId, negative, emoji, slice.before, slice.after, slice.total
        ).causedBy(action));
    } catch (e) {
        dispatch(reactionsDialogPastReactionsLoadFailed(posting.id, null, negative, emoji).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function reactionsDialogTotalsLoadSaga(action: WithContext<ReactionsDialogTotalsLoadAction>): Promise<void> {
    const {nodeName, posting, commentId} = select(state => ({
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
            ? await Node.getPostingReactionTotals(action, rNodeName, rPostingId)
            : await Node.getCommentReactionTotals(action, rNodeName, rPostingId, commentId)
        dispatch(reactionsDialogTotalsLoaded(totals.positive, totals.negative).causedBy(action));
    } catch (e) {
        dispatch(reactionsDialogTotalsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function reactionVerifySaga(action: WithContext<ReactionVerifyAction>): Promise<void> {
    const {postingId, commentId, ownerName} = action.payload;
    const nodeName = action.context.ownerName;
    if (nodeName == null) {
        dispatch(reactionVerifyFailed(postingId, commentId, ownerName).causedBy(action));
        return;
    }
    try {
        if (commentId == null) {
            await Node.verifyRemotePostingReaction(action, REL_HOME, nodeName, postingId, ownerName);
        } else {
            await Node.verifyRemoteCommentReaction(action, REL_HOME, nodeName, postingId, commentId, ownerName);
        }
    } catch (e) {
        dispatch(reactionVerifyFailed(postingId, commentId, ownerName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

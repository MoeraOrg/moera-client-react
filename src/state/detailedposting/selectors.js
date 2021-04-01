import { createSelector } from 'reselect';

import { getPosting, isPostingBeingDeleted, isPostingCached } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";

export function getDetailedPostingId(state) {
    return state.detailedPosting.id;
}

export function isDetailedPostingDefined(state) {
    return !!getDetailedPostingId(state);
}

export function isDetailedPostingId(state, id) {
    return state.detailedPosting.id === id;
}

export function isDetailedPostingCached(state) {
    return isPostingCached(state, getDetailedPostingId(state));
}

export function getDetailedPosting(state) {
    return getPosting(state, getDetailedPostingId(state));
}

export function isDetailedPostingBeingDeleted(state) {
    return isPostingBeingDeleted(state, getDetailedPostingId(state));
}

export function isDetailedPostingToBeLoaded(state) {
    return !state.detailedPosting.loading && getDetailedPosting(state) == null;
}

export function isDetailedPostingPositioned(state) {
    return state.detailedPosting.positioned;
}

export function getCommentsState(state) {
    return state.detailedPosting.comments;
}

export function getCommentsReceiverName(state) {
    return getCommentsState(state).receiverName;
}

export function getCommentsReceiverPostingId(state) {
    return getCommentsState(state).receiverPostingId;
}

export function isCommentsReceiverPostingId(state, id) {
    return getCommentsState(state).receiverPostingId === id;
}

export function isCommentsReceiverToBeSwitched(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null) {
        return false;
    }
    const receiverName = posting.receiverName ?? ownerName;
    const receiverPostingId = posting.receiverPostingId ?? posting.id;
    const comments = getCommentsState(state);

    return comments.receiverName !== receiverName || comments.receiverPostingId !== receiverPostingId;
}

export function getComments(state) {
    return getCommentsState(state).comments;
}

export function getComment(state, id) {
    return getCommentsState(state).comments.find(c => c.id === id);
}

export function getFocusedCommentId(state) {
    return getCommentsState(state).focusedCommentId;
}

export function isFocusedCommentToBeLoaded(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null || isCommentsReceiverToBeSwitched(state)) {
        return false;
    }
    const comments = getCommentsState(state);
    return comments.focusedCommentId != null && !comments.loadedFocusedComment && !comments.loadingFocusedComment;
}

export function isFocusedCommentReady(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null || isCommentsReceiverToBeSwitched(state)) {
        return false;
    }
    const comments = getCommentsState(state);
    return comments.focusedCommentId == null || comments.loadedFocusedComment;
}

export function isFocusedCommentInList(state) {
    const comments = getCommentsState(state);
    return comments.focusedCommentId == null || getComment(state, comments.focusedCommentId) != null;
}

export function isCommentsReadyToBeLoaded(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    return ownerName != null && posting != null && !isCommentsReceiverToBeSwitched(state)
        && isFocusedCommentReady(state);
}

export function isFutureCommentsToBeLoaded(state) {
    const comments = getCommentsState(state);
    return isCommentsReadyToBeLoaded(state) && !comments.loadingFuture
        && (comments.before === comments.focusedMoment || comments.before === comments.anchor)
        && comments.before < Number.MAX_SAFE_INTEGER;
}

export function isPastCommentsToBeLoaded(state) {
    const comments = getCommentsState(state);
    return isCommentsReadyToBeLoaded(state) && !comments.loadingPast
        && (comments.after === comments.focusedMoment - 1 || comments.after === comments.anchor)
        && comments.after > Number.MIN_SAFE_INTEGER;
}

export function isCommentMomentInLoadedRange(state, moment) {
    const comments = getCommentsState(state);
    return moment != null && moment <= comments.before && moment > comments.after;
}

export function isCommentsFocused(state) {
    return state.detailedPosting.comments.focused;
}

export function isCommentComposerFocused(state) {
    return state.detailedPosting.compose.focused;
}

export function getCommentComposerCommentId(state) {
    return state.detailedPosting.compose.commentId;
}

export function getCommentComposerComment(state) {
    return state.detailedPosting.compose.comment;
}

export function getCommentComposerRepliedToId(state) {
    return state.detailedPosting.compose.repliedToId;
}

export function getCommentComposerRepliedToName(state) {
    return state.detailedPosting.compose.repliedToName;
}

export function isCommentComposerReplied(state) {
    return getCommentComposerRepliedToId(state) != null;
}

export function isCommentDialogShown(state) {
    return state.detailedPosting.compose.showDialog;
}

export function isCommentComposerConflict(state) {
    return state.detailedPosting.compose.conflict;
}

export function isGlanceCommentToBeLoaded(state) {
    const comments = getCommentsState(state);
    return !comments.loadedGlanceComment
        || (comments.glanceCommentId != null
            && (comments.glanceComment == null || comments.glanceComment.id !== comments.glanceCommentId));
}

function putName(names, nodeName, fullName) {
    if (!names.has(nodeName)) {
        names.set(nodeName, {nodeName, fullName, count: 1});
    } else {
        names.get(nodeName).count++;
    }
}

export const getNamesInComments = createSelector(
    getComments,
    comments => {
        const names = new Map();
        for (const comment of comments) {
            putName(names, comment.ownerName, comment.ownerFullName);
            if (comment.repliedTo) {
                putName(names, comment.repliedTo.name, comment.repliedTo.fullName);
            }
        }
        return [...names.values()];
    }
);

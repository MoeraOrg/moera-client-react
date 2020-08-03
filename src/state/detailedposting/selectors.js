import { getPosting, isPostingBeingDeleted } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";

export function getDetailedPostingId(state) {
    return state.detailedPosting.id;
}

export function isDetailedPostingId(state, id) {
    return state.detailedPosting.id === id;
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

export function getCommentsState(state) {
    return state.detailedPosting.comments;
}

export function getCommentsReceiverPostingId(state) {
    return getCommentsState(state).receiverPostingId;
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

export function isCommentsToBeLoaded(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null || isCommentsReceiverToBeSwitched(state)) {
        return false;
    }
    const comments = getCommentsState(state);
    return comments.comments.length === 0 && !comments.loadingFuture && !comments.loadingPast
        && (comments.before < Number.MAX_SAFE_INTEGER || comments.after > Number.MIN_SAFE_INTEGER);
}

export function isFutureCommentsToBeLoaded(state) {
    return isCommentsToBeLoaded(state) && getCommentsState(state).before < Number.MAX_SAFE_INTEGER;
}

export function isPastCommentsToBeLoaded(state) {
    return isCommentsToBeLoaded(state) && getCommentsState(state).after > Number.MIN_SAFE_INTEGER;
}

export function isCommentMomentInLoadedRange(state, moment) {
    const comments = getCommentsState(state);
    return moment != null && moment <= comments.before && moment > comments.after;
}

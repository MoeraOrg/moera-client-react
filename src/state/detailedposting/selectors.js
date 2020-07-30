import { getPosting, isPostingBeingDeleted } from "state/postings/selectors";

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

export function isCommentsToBeLoaded(state) {
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

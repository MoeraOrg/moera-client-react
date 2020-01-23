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

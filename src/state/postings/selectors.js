import selectn from 'selectn';

export function getPosting(state, id) {
    return selectn(["postings", id, "posting"], state);
}

export function isPostingCached(state, id) {
    return !!getPosting(state, id);
}

export function isPostingBeingDeleted(state, id) {
    return selectn(["postings", id, "deleting"], state);
}

export function getPostingVerificationStatus(state, id) {
    return selectn(["postings", id, "verificationStatus"], state);
}

export function getPostingMoment(posting, feedName) {
    const ref = posting.feedReferences ? posting.feedReferences.find(r => r.feedName === feedName) : null;
    return ref ? ref.moment : null;
}

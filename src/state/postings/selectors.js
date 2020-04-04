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

function getPostingFeedReference(posting, feedName) {
    return posting.feedReferences ? posting.feedReferences.find(r => r.feedName === feedName) : null;
}

export function getPostingStoryId(posting, feedName) {
    const ref = getPostingFeedReference(posting, feedName);
    return ref ? ref.storyId : null;
}

export function getPostingMoment(posting, feedName) {
    const ref = getPostingFeedReference(posting, feedName);
    return ref ? ref.moment : null;
}

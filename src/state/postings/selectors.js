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

export function getPostingFeedReference(posting, feedName) {
    return posting.feedReferences ? posting.feedReferences.find(r => r.feedName === feedName) : null;
}

export function hasPostingFeedReference(posting, feedName) {
    return getPostingFeedReference(posting, feedName) != null;
}

export function getPostingMoment(posting, feedName) {
    const ref = getPostingFeedReference(posting, feedName);
    return ref ? ref.moment : null;
}

export function getPostingStory(posting, feedName) {
    const ref = getPostingFeedReference(posting, feedName);
    if (ref == null) {
        return null;
    }
    const story = {...ref};
    story.id = ref.storyId;
    story.posting = posting;
    delete story.storyId;
    return story;
}

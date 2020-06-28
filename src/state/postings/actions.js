export const POSTING_SET = "POSTING_SET";
export const postingSet = (posting) => ({
    type: POSTING_SET,
    payload: {posting}
});

export const POSTING_DELETE = "POSTING_DELETE";
export const postingDelete = (id) => ({
    type: POSTING_DELETE,
    payload: {id}
});

export const POSTING_DELETED = "POSTING_DELETED";
export const postingDeleted = (id, feedReferences) => ({
    type: POSTING_DELETED,
    payload: {id, feedReferences}
});

export const POSTING_DELETE_FAILED = "POSTING_DELETE_FAILED";
export const postingDeleteFailed = (id) => ({
    type: POSTING_DELETE_FAILED,
    payload: {id}
});

export const POSTING_LOAD = "POSTING_LOAD";
export const postingLoad = (id) => ({
    type: POSTING_LOAD,
    payload: {id}
});

export const POSTING_LOAD_FAILED = "POSTING_LOAD_FAILED";
export const postingLoadFailed = (id) => ({
    type: POSTING_LOAD_FAILED,
    payload: {id}
});

export const POSTING_VERIFY = "POSTING_VERIFY";
export const postingVerify = (id) => ({
    type: POSTING_VERIFY,
    payload: {id}
});

export const POSTING_VERIFY_FAILED = "POSTING_VERIFY_FAILED";
export const postingVerifyFailed = (id) => ({
    type: POSTING_VERIFY_FAILED,
    payload: {id}
});

export const POSTING_REACT = "POSTING_REACT";
export const postingReact = (id, negative, emoji) => ({
    type: POSTING_REACT,
    payload: {id, negative, emoji}
});

export const POSTING_REACTION_LOAD = "POSTING_REACTION_LOAD";
export const postingReactionLoad = (id) => ({
    type: POSTING_REACTION_LOAD,
    payload: {id}
});

export const POSTING_REACTION_DELETE = "POSTING_REACTION_DELETE";
export const postingReactionDelete = (id) => ({
    type: POSTING_REACTION_DELETE,
    payload: {id}
});

export const POSTING_REACTION_SET = "POSTING_REACTION_SET";
export const postingReactionSet = (id, reaction, totals) => ({
    type: POSTING_REACTION_SET,
    payload: {id, reaction, totals}
});

export const POSTING_COPY_LINK = "POSTING_COPY_LINK";
export const postingCopyLink = (id) => ({
    type: POSTING_COPY_LINK,
    payload: {id}
});

export const DETAILED_POSTING_LOAD = "DETAILED_POSTING_LOAD";
export const detailedPostingLoad = () => ({
    type: DETAILED_POSTING_LOAD
});

export const DETAILED_POSTING_LOADED = "DETAILED_POSTING_LOADED";
export const detailedPostingLoaded = (posting) => ({
    type: DETAILED_POSTING_LOADED,
    payload: {posting}
});

export const DETAILED_POSTING_LOAD_FAILED = "DETAILED_POSTING_LOAD_FAILED";
export const detailedPostingLoadFailed = () => ({
    type: DETAILED_POSTING_LOAD_FAILED
});

export const COMMENTS_PAST_SLICE_LOAD = "COMMENTS_PAST_SLICE_LOAD";
export const commentsPastSliceLoad = () => ({
    type: COMMENTS_PAST_SLICE_LOAD
});

export const COMMENTS_PAST_SLICE_LOAD_FAILED = "COMMENTS_PAST_SLICE_LOAD_FAILED";
export const commentsPastSliceLoadFailed = (postingId) => ({
    type: COMMENTS_PAST_SLICE_LOAD_FAILED,
    payload: {postingId}
});

export const COMMENTS_FUTURE_SLICE_LOAD = "COMMENTS_FUTURE_SLICE_LOAD";
export const commentsFutureSliceLoad = () => ({
    type: COMMENTS_FUTURE_SLICE_LOAD
});

export const COMMENTS_FUTURE_SLICE_LOAD_FAILED = "COMMENTS_FUTURE_SLICE_LOAD_FAILED";
export const commentsFutureSliceLoadFailed = (postingId) => ({
    type: COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    payload: {postingId}
});

export const COMMENTS_PAST_SLICE_SET = "COMMENTS_PAST_SLICE_SET";
export const commentsPastSliceSet = (postingId, comments, before, after) => ({
    type: COMMENTS_PAST_SLICE_SET,
    payload: {postingId, comments, before, after}
});

export const COMMENTS_FUTURE_SLICE_SET = "COMMENTS_FUTURE_SLICE_SET";
export const commentsFutureSliceSet = (postingId, comments, before, after) => ({
    type: COMMENTS_FUTURE_SLICE_SET,
    payload: {postingId, comments, before, after}
});

export const COMMENTS_UNSET = "COMMENTS_UNSET";
export const commentsUnset = () => ({
    type: COMMENTS_UNSET
});

export const COMMENTS_SCROLL_TO_ANCHOR = "COMMENTS_SCROLL_TO_ANCHOR";
export const commentsScrollToAnchor = (anchor) => ({
    type: COMMENTS_SCROLL_TO_ANCHOR,
    payload: {anchor}
});

export const COMMENTS_SCROLLED_TO_ANCHOR = "COMMENTS_SCROLLED_TO_ANCHOR";
export const commentsScrolledToAnchor = () => ({
    type: COMMENTS_SCROLLED_TO_ANCHOR
});

export const COMMENT_POST = "COMMENT_POST";
export const commentPost = (postingId, commentText) => ({
    type: COMMENT_POST,
    payload: {postingId, commentText}
});

export const COMMENT_POST_SUCCEEDED = "COMMENT_POST_SUCCEEDED";
export const commentPostSucceeded = (comment, total) => ({
    type: COMMENT_POST_SUCCEEDED,
    payload: {comment, total}
});

export const COMMENT_POST_FAILED = "COMMENT_POST_FAILED";
export const commentPostFailed = (postingId) => ({
    type: COMMENT_POST_FAILED,
    payload: {postingId}
});

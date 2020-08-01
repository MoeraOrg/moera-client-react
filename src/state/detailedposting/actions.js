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

export const COMMENTS_RECEIVER_SWITCH = "COMMENTS_RECEIVER_SWITCH";
export const commentsReceiverSwitch = () => ({
    type: COMMENTS_RECEIVER_SWITCH
});

export const COMMENTS_RECEIVER_SWITCHED = "COMMENTS_RECEIVER_SWITCHED";
export const commentsReceiverSwitched = (nodeName, postingId) => ({
    type: COMMENTS_RECEIVER_SWITCHED,
    payload: {nodeName, postingId}
});

export const COMMENTS_PAST_SLICE_LOAD = "COMMENTS_PAST_SLICE_LOAD";
export const commentsPastSliceLoad = () => ({
    type: COMMENTS_PAST_SLICE_LOAD
});

export const COMMENTS_PAST_SLICE_LOAD_FAILED = "COMMENTS_PAST_SLICE_LOAD_FAILED";
export const commentsPastSliceLoadFailed = (nodeName, postingId) => ({
    type: COMMENTS_PAST_SLICE_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENTS_FUTURE_SLICE_LOAD = "COMMENTS_FUTURE_SLICE_LOAD";
export const commentsFutureSliceLoad = () => ({
    type: COMMENTS_FUTURE_SLICE_LOAD
});

export const COMMENTS_FUTURE_SLICE_LOAD_FAILED = "COMMENTS_FUTURE_SLICE_LOAD_FAILED";
export const commentsFutureSliceLoadFailed = (nodeName, postingId) => ({
    type: COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENTS_PAST_SLICE_SET = "COMMENTS_PAST_SLICE_SET";
export const commentsPastSliceSet = (nodeName, postingId, comments, before, after) => ({
    type: COMMENTS_PAST_SLICE_SET,
    payload: {nodeName, postingId, comments, before, after}
});

export const COMMENTS_FUTURE_SLICE_SET = "COMMENTS_FUTURE_SLICE_SET";
export const commentsFutureSliceSet = (nodeName, postingId, comments, before, after) => ({
    type: COMMENTS_FUTURE_SLICE_SET,
    payload: {nodeName, postingId, comments, before, after}
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
export const commentPost = (nodeName, postingId, commentText) => ({
    type: COMMENT_POST,
    payload: {nodeName, postingId, commentText}
});

export const COMMENT_POSTED = "COMMENT_POSTED";
export const commentPosted = (nodeName, postingId) => ({
    type: COMMENT_POSTED,
    payload: {nodeName, postingId}
});

export const COMMENT_POST_FAILED = "COMMENT_POST_FAILED";
export const commentPostFailed = (nodeName, postingId) => ({
    type: COMMENT_POST_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENT_SET = "COMMENT_SET";
export const commentSet = (nodeName, comment) => ({
    type: COMMENT_SET,
    payload: {nodeName, comment}
});

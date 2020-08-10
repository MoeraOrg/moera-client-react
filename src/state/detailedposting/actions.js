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

export const COMMENTS_SCROLLED_TO_COMMENTS = "COMMENTS_SCROLLED_TO_COMMENTS";
export const commentsScrolledToComments = () => ({
    type: COMMENTS_SCROLLED_TO_COMMENTS
});

export const COMMENTS_SCROLLED_TO_COMPOSER = "COMMENTS_SCROLLED_TO_COMPOSER";
export const commentsScrolledToComposer = () => ({
    type: COMMENTS_SCROLLED_TO_COMPOSER
});

export const COMMENT_POST = "COMMENT_POST";
export const commentPost = (postingId, commentId, commentText) => ({
    type: COMMENT_POST,
    payload: {postingId, commentId, commentText}
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

export const COMMENT_LOAD = "COMMENT_LOAD";
export const commentLoad = (commentId) => ({
    type: COMMENT_LOAD,
    payload: {commentId}
});

export const COMMENT_LOAD_FAILED = "COMMENT_LOAD_FAILED";
export const commentLoadFailed = (nodeName, postingId, commentId) => ({
    type: COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DELETE = "COMMENT_DELETE";
export const commentDelete = (commentId) => ({
    type: COMMENT_DELETE,
    payload: {commentId}
});

export const COMMENT_DELETED = "COMMENT_DELETED";
export const commentDeleted = (nodeName, postingId, commentId) => ({
    type: COMMENT_DELETED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DELETE_FAILED = "COMMENT_DELETE_FAILED";
export const commentDeleteFailed = (nodeName, postingId, commentId) => ({
    type: COMMENT_DELETE_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const FOCUSED_COMMENT_LOAD = "FOCUSED_COMMENT_LOAD";
export const focusedCommentLoad = () => ({
    type: FOCUSED_COMMENT_LOAD
});

export const FOCUSED_COMMENT_LOADED = "FOCUSED_COMMENT_LOADED";
export const focusedCommentLoaded = (nodeName, comment) => ({
    type: FOCUSED_COMMENT_LOADED,
    payload: {nodeName, comment}
});

export const FOCUSED_COMMENT_LOAD_FAILED = "FOCUSED_COMMENT_LOAD_FAILED";
export const focusedCommentLoadFailed = (nodeName, postingId) => ({
    type: FOCUSED_COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENT_COPY_LINK = "COMMENT_COPY_LINK";
export const commentCopyLink = (id, postingId) => ({
    type: COMMENT_COPY_LINK,
    payload: {id, postingId}
});

export const OPEN_COMMENT_DIALOG = "OPEN_COMMENT_DIALOG";
export const openCommentDialog = (commentId) => ({
    type: OPEN_COMMENT_DIALOG,
    payload: {commentId}
});

export const CLOSE_COMMENT_DIALOG = "CLOSE_COMMENT_DIALOG";
export const closeCommentDialog = () => ({
    type: CLOSE_COMMENT_DIALOG
});

export const COMMENT_DIALOG_COMMENT_LOAD = "COMMENT_DIALOG_COMMENT_LOAD";
export const commentDialogCommentLoad = () => ({
    type: COMMENT_DIALOG_COMMENT_LOAD
});

export const COMMENT_DIALOG_COMMENT_LOADED = "COMMENT_DIALOG_COMMENT_LOADED";
export const commentDialogCommentLoaded = (comment) => ({
    type: COMMENT_DIALOG_COMMENT_LOADED,
    payload: {comment}
});

export const COMMENT_DIALOG_COMMENT_LOAD_FAILED = "COMMENT_DIALOG_COMMENT_LOAD_FAILED";
export const commentDialogCommentLoadFailed = () => ({
    type: COMMENT_DIALOG_COMMENT_LOAD_FAILED
});

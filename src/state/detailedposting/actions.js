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

export const COMMENTS_LOAD_ALL = "COMMENTS_LOAD_ALL";
export const commentsLoadAll = () => ({
    type: COMMENTS_LOAD_ALL
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
export const commentsPastSliceSet = (nodeName, postingId, comments, before, after, total,
                                     totalInPast, totalInFuture) => ({
    type: COMMENTS_PAST_SLICE_SET,
    payload: {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
});

export const COMMENTS_FUTURE_SLICE_SET = "COMMENTS_FUTURE_SLICE_SET";
export const commentsFutureSliceSet = (nodeName, postingId, comments, before, after, total,
                                       totalInPast, totalInFuture) => ({
    type: COMMENTS_FUTURE_SLICE_SET,
    payload: {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
});

export const COMMENTS_SLICE_UPDATE = "COMMENTS_SLICE_UPDATE";
export const commentsSliceUpdate = (nodeName, postingId, comments, before, after, total,
                                    totalInPast, totalInFuture) => ({
    type: COMMENTS_SLICE_UPDATE,
    payload: {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
});

export const COMMENTS_UPDATE = "COMMENTS_UPDATE";
export const commentsUpdate = () => ({
    type: COMMENTS_UPDATE
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

export const COMMENTS_SCROLL_TO_COMPOSER = "COMMENTS_SCROLL_TO_COMPOSER";
export const commentsScrollToComposer = () => ({
    type: COMMENTS_SCROLL_TO_COMPOSER
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

export const COMMENT_COMPOSE_UNSET = "COMMENT_COMPOSE_UNSET";
export const commentComposeUnset = () => ({
    type: COMMENT_COMPOSE_UNSET
});

export const COMMENT_POST = "COMMENT_POST";
export const commentPost = (postingId, commentId, commentText) => ({
    type: COMMENT_POST,
    payload: {postingId, commentId, commentText}
});

export const COMMENT_POSTED = "COMMENT_POSTED";
export const commentPosted = (nodeName, postingId, commentId, moment) => ({
    type: COMMENT_POSTED,
    payload: {nodeName, postingId, commentId, moment}
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

export const FOCUS_COMMENT = "FOCUS_COMMENT";
export const focusComment = () => ({
    type: FOCUS_COMMENT
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

export const COMMENT_DIALOG_CONFLICT = "COMMENT_DIALOG_CONFLICT";
export const commentDialogConflict = () => ({
    type: COMMENT_DIALOG_CONFLICT
});

export const COMMENT_DIALOG_CONFLICT_CLOSE = "COMMENT_DIALOG_CONFLICT_CLOSE";
export const commentDialogConflictClose = () => ({
    type: COMMENT_DIALOG_CONFLICT_CLOSE
});

export const COMMENT_VERIFY = "COMMENT_VERIFY";
export const commentVerify = (commentId) => ({
    type: COMMENT_VERIFY,
    payload: {commentId}
});

export const COMMENT_VERIFY_FAILED = "COMMENT_VERIFY_FAILED";
export const commentVerifyFailed = (nodeName, postingId, commentId) => ({
    type: COMMENT_VERIFY_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_REACT = "COMMENT_REACT";
export const commentReact = (id, negative, emoji) => ({
    type: COMMENT_REACT,
    payload: {id, negative, emoji}
});

export const COMMENT_REACTION_LOAD = "COMMENT_REACTION_LOAD";
export const commentReactionLoad = (id, postingId) => ({
    type: COMMENT_REACTION_LOAD,
    payload: {id, postingId}
});

export const COMMENT_REACTION_DELETE = "COMMENT_REACTION_DELETE";
export const commentReactionDelete = (id, postingId) => ({
    type: COMMENT_REACTION_DELETE,
    payload: {id, postingId}
});

export const COMMENT_REACTION_SET = "COMMENT_REACTION_SET";
export const commentReactionSet = (nodeName, id, postingId, reaction, totals) => ({
    type: COMMENT_REACTION_SET,
    payload: {nodeName, id, postingId, reaction, totals}
});

export const COMMENT_REPLY = "COMMENT_REPLY";
export const commentReply = (commentId, ownerName, heading) => ({
    type: COMMENT_REPLY,
    payload: {commentId, ownerName, heading}
});

export const COMMENT_REPLIED_TO_SET = "COMMENT_REPLIED_TO_SET";
export const commentRepliedToSet = (commentId, ownerName, heading) => ({
    type: COMMENT_REPLIED_TO_SET,
    payload: {commentId, ownerName, heading}
});

export const COMMENT_REPLIED_TO_UNSET = "COMMENT_REPLIED_TO_UNSET";
export const commentRepliedToUnset = () => ({
    type: COMMENT_REPLIED_TO_UNSET
});

export const GLANCE_COMMENT = "GLANCE_COMMENT";
export const glanceComment = (commentId) => ({
    type: GLANCE_COMMENT,
    payload: {commentId}
});

export const GLANCE_COMMENT_LOAD = "GLANCE_COMMENT_LOAD";
export const glanceCommentLoad = () => ({
    type: GLANCE_COMMENT_LOAD
});

export const GLANCE_COMMENT_LOADED = "GLANCE_COMMENT_LOADED";
export const glanceCommentLoaded = (nodeName, comment) => ({
    type: GLANCE_COMMENT_LOADED,
    payload: {nodeName, comment}
});

export const GLANCE_COMMENT_LOAD_FAILED = "GLANCE_COMMENT_LOAD_FAILED";
export const glanceCommentLoadFailed = (nodeName, postingId) => ({
    type: GLANCE_COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId}
});

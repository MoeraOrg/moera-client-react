import { ActionBase } from "state/action-base";
import { CommentInfo, CommentText, PostingInfo, ReactionAttributes, ReactionTotalsInfo } from "api/node/api-types";

export const DETAILED_POSTING_LOAD = "DETAILED_POSTING_LOAD";
type DetailedPostingLoadAction = ActionBase<typeof DETAILED_POSTING_LOAD, never>;
export const detailedPostingLoad = (): DetailedPostingLoadAction => ({
    type: DETAILED_POSTING_LOAD
});

export const DETAILED_POSTING_LOADED = "DETAILED_POSTING_LOADED";
type DetailedPostingLoadedAction = ActionBase<typeof DETAILED_POSTING_LOADED, {
    posting: PostingInfo;
}>;
export const detailedPostingLoaded = (posting: PostingInfo): DetailedPostingLoadedAction => ({
    type: DETAILED_POSTING_LOADED,
    payload: {posting}
});

export const DETAILED_POSTING_LOAD_FAILED = "DETAILED_POSTING_LOAD_FAILED";
type DetailedPostingLoadFailedAction = ActionBase<typeof DETAILED_POSTING_LOAD_FAILED, never>;
export const detailedPostingLoadFailed = (): DetailedPostingLoadFailedAction => ({
    type: DETAILED_POSTING_LOAD_FAILED
});

export const COMMENTS_RECEIVER_SWITCH = "COMMENTS_RECEIVER_SWITCH";
type CommentsReceiverSwitchAction = ActionBase<typeof COMMENTS_RECEIVER_SWITCH, never>;
export const commentsReceiverSwitch = (): CommentsReceiverSwitchAction => ({
    type: COMMENTS_RECEIVER_SWITCH
});

export const COMMENTS_RECEIVER_SWITCHED = "COMMENTS_RECEIVER_SWITCHED";
type CommentsReceiverSwitchedAction = ActionBase<typeof COMMENTS_RECEIVER_SWITCHED, {
    nodeName: string;
    fullName: string | null;
    postingId: string;
}>;
export const commentsReceiverSwitched = (nodeName: string, fullName: string | null,
                                         postingId: string): CommentsReceiverSwitchedAction => ({
    type: COMMENTS_RECEIVER_SWITCHED,
    payload: {nodeName, fullName, postingId}
});

export const COMMENTS_LOAD_ALL = "COMMENTS_LOAD_ALL";
type CommentsLoadAllAction = ActionBase<typeof COMMENTS_LOAD_ALL, never>;
export const commentsLoadAll = (): CommentsLoadAllAction => ({
    type: COMMENTS_LOAD_ALL
});

export const COMMENTS_PAST_SLICE_LOAD = "COMMENTS_PAST_SLICE_LOAD";
type CommentsPastSliceLoadAction = ActionBase<typeof COMMENTS_PAST_SLICE_LOAD, never>;
export const commentsPastSliceLoad = (): CommentsPastSliceLoadAction => ({
    type: COMMENTS_PAST_SLICE_LOAD
});

export const COMMENTS_PAST_SLICE_LOAD_FAILED = "COMMENTS_PAST_SLICE_LOAD_FAILED";
type CommentsPastSliceLoadFailedAction = ActionBase<typeof COMMENTS_PAST_SLICE_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const commentsPastSliceLoadFailed = (nodeName: string,
                                            postingId: string): CommentsPastSliceLoadFailedAction => ({
    type: COMMENTS_PAST_SLICE_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENTS_FUTURE_SLICE_LOAD = "COMMENTS_FUTURE_SLICE_LOAD";
type CommentsFutureSliceLoadAction = ActionBase<typeof COMMENTS_FUTURE_SLICE_LOAD, never>;
export const commentsFutureSliceLoad = (): CommentsFutureSliceLoadAction => ({
    type: COMMENTS_FUTURE_SLICE_LOAD
});

export const COMMENTS_FUTURE_SLICE_LOAD_FAILED = "COMMENTS_FUTURE_SLICE_LOAD_FAILED";
type CommentsFutureSliceLoadFailedAction = ActionBase<typeof COMMENTS_FUTURE_SLICE_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const commentsFutureSliceLoadFailed = (nodeName: string,
                                              postingId: string): CommentsFutureSliceLoadFailedAction => ({
    type: COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENTS_PAST_SLICE_SET = "COMMENTS_PAST_SLICE_SET";
type CommentsPastSliceSetAction = ActionBase<typeof COMMENTS_PAST_SLICE_SET, {
    nodeName: string;
    postingId: string;
    comments: CommentInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const commentsPastSliceSet = (nodeName: string, postingId: string, comments: CommentInfo[], before: number,
                                     after: number, total: number, totalInPast: number,
                                     totalInFuture: number): CommentsPastSliceSetAction => ({
    type: COMMENTS_PAST_SLICE_SET,
    payload: {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
});

export const COMMENTS_FUTURE_SLICE_SET = "COMMENTS_FUTURE_SLICE_SET";
type CommentsFutureSliceSetAction = ActionBase<typeof COMMENTS_FUTURE_SLICE_SET, {
    nodeName: string;
    postingId: string;
    comments: CommentInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const commentsFutureSliceSet = (nodeName: string, postingId: string, comments: CommentInfo[], before: number,
                                       after: number, total: number, totalInPast: number,
                                       totalInFuture: number): CommentsFutureSliceSetAction => ({
    type: COMMENTS_FUTURE_SLICE_SET,
    payload: {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
});

export const COMMENTS_SLICE_UPDATE = "COMMENTS_SLICE_UPDATE";
type CommentsSliceUpdateAction = ActionBase<typeof COMMENTS_SLICE_UPDATE, {
    nodeName: string;
    postingId: string;
    comments: CommentInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const commentsSliceUpdate = (nodeName: string, postingId: string, comments: CommentInfo[], before: number,
                                    after: number, total: number, totalInPast: number,
                                    totalInFuture: number): CommentsSliceUpdateAction => ({
    type: COMMENTS_SLICE_UPDATE,
    payload: {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
});

export const COMMENTS_UPDATE = "COMMENTS_UPDATE";
type CommentsUpdateAction = ActionBase<typeof COMMENTS_UPDATE, never>;
export const commentsUpdate = (): CommentsUpdateAction => ({
    type: COMMENTS_UPDATE
});

export const COMMENTS_UNSET = "COMMENTS_UNSET";
type CommentsUnsetAction = ActionBase<typeof COMMENTS_UNSET, never>;
export const commentsUnset = (): CommentsUnsetAction => ({
    type: COMMENTS_UNSET
});

export const COMMENTS_SCROLL_TO_ANCHOR = "COMMENTS_SCROLL_TO_ANCHOR";
type CommentsScrollToAnchorAction = ActionBase<typeof COMMENTS_SCROLL_TO_ANCHOR, {
    anchor: number;
}>;
export const commentsScrollToAnchor = (anchor: number): CommentsScrollToAnchorAction => ({
    type: COMMENTS_SCROLL_TO_ANCHOR,
    payload: {anchor}
});

export const COMMENTS_SCROLL_TO_COMPOSER = "COMMENTS_SCROLL_TO_COMPOSER";
type CommentsScrollToComposerAction = ActionBase<typeof COMMENTS_SCROLL_TO_COMPOSER, never>;
export const commentsScrollToComposer = (): CommentsScrollToComposerAction => ({
    type: COMMENTS_SCROLL_TO_COMPOSER
});

export const COMMENTS_SCROLLED_TO_ANCHOR = "COMMENTS_SCROLLED_TO_ANCHOR";
type CommentsScrolledToAnchorAction = ActionBase<typeof COMMENTS_SCROLLED_TO_ANCHOR, never>;
export const commentsScrolledToAnchor = (): CommentsScrolledToAnchorAction => ({
    type: COMMENTS_SCROLLED_TO_ANCHOR
});

export const COMMENTS_SCROLLED_TO_COMMENTS = "COMMENTS_SCROLLED_TO_COMMENTS";
type CommentsScrolledToCommentsAction = ActionBase<typeof COMMENTS_SCROLLED_TO_COMMENTS, never>;
export const commentsScrolledToComments = (): CommentsScrolledToCommentsAction => ({
    type: COMMENTS_SCROLLED_TO_COMMENTS
});

export const COMMENTS_SCROLLED_TO_COMPOSER = "COMMENTS_SCROLLED_TO_COMPOSER";
type CommentsScrolledToComposerAction = ActionBase<typeof COMMENTS_SCROLLED_TO_COMPOSER, never>;
export const commentsScrolledToComposer = (): CommentsScrolledToComposerAction => ({
    type: COMMENTS_SCROLLED_TO_COMPOSER
});

export const COMMENT_COMPOSE_UNSET = "COMMENT_COMPOSE_UNSET";
type CommentComposeUnsetAction = ActionBase<typeof COMMENT_COMPOSE_UNSET, never>;
export const commentComposeUnset = (): CommentComposeUnsetAction => ({
    type: COMMENT_COMPOSE_UNSET
});

export const COMMENT_POST = "COMMENT_POST";
type CommentPostAction = ActionBase<typeof COMMENT_POST, {
    postingId: string;
    commentId: string | null;
    commentText: CommentText;
}>;
export const commentPost = (postingId: string, commentId: string | null,
                            commentText: CommentText): CommentPostAction => ({
    type: COMMENT_POST,
    payload: {postingId, commentId, commentText}
});

export const COMMENT_POSTED = "COMMENT_POSTED";
type CommentPostedAction = ActionBase<typeof COMMENT_POSTED, {
    nodeName: string;
    postingId: string;
    commentId: string;
    moment: number;
}>;
export const commentPosted = (nodeName: string, postingId: string, commentId: string,
                              moment: number): CommentPostedAction => ({
    type: COMMENT_POSTED,
    payload: {nodeName, postingId, commentId, moment}
});

export const COMMENT_POST_FAILED = "COMMENT_POST_FAILED";
type CommentPostFailedAction = ActionBase<typeof COMMENT_POST_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const commentPostFailed = (nodeName: string, postingId: string): CommentPostFailedAction => ({
    type: COMMENT_POST_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENT_SET = "COMMENT_SET";
type CommentSetAction = ActionBase<typeof COMMENT_SET, {
    nodeName: string;
    comment: CommentInfo;
}>;
export const commentSet = (nodeName: string, comment: CommentInfo): CommentSetAction => ({
    type: COMMENT_SET,
    payload: {nodeName, comment}
});

export const COMMENT_LOAD = "COMMENT_LOAD";
type CommentLoadAction = ActionBase<typeof COMMENT_LOAD, {
    commentId: string;
}>;
export const commentLoad = (commentId: string): CommentLoadAction => ({
    type: COMMENT_LOAD,
    payload: {commentId}
});

export const COMMENT_LOAD_FAILED = "COMMENT_LOAD_FAILED";
type CommentLoadFailedAction = ActionBase<typeof COMMENT_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentLoadFailed = (nodeName: string, postingId: string, commentId: string): CommentLoadFailedAction => ({
    type: COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DELETE = "COMMENT_DELETE";
type CommentDeleteAction = ActionBase<typeof COMMENT_DELETE, {
    commentId: string;
}>;
export const commentDelete = (commentId: string): CommentDeleteAction => ({
    type: COMMENT_DELETE,
    payload: {commentId}
});

export const COMMENT_DELETED = "COMMENT_DELETED";
type CommentDeletedAction = ActionBase<typeof COMMENT_DELETED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentDeleted = (nodeName: string, postingId: string, commentId: string): CommentDeletedAction => ({
    type: COMMENT_DELETED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DELETE_FAILED = "COMMENT_DELETE_FAILED";
type CommentDeleteFailedAction = ActionBase<typeof COMMENT_DELETE_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentDeleteFailed = (nodeName: string, postingId: string,
                                    commentId: string): CommentDeleteFailedAction => ({
    type: COMMENT_DELETE_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const FOCUS_COMMENT = "FOCUS_COMMENT";
type FocusCommentAction = ActionBase<typeof FOCUS_COMMENT, never>;
export const focusComment = (): FocusCommentAction => ({
    type: FOCUS_COMMENT
});

export const FOCUSED_COMMENT_LOAD = "FOCUSED_COMMENT_LOAD";
type FocusedCommentLoadAction = ActionBase<typeof FOCUSED_COMMENT_LOAD, never>;
export const focusedCommentLoad = (): FocusedCommentLoadAction => ({
    type: FOCUSED_COMMENT_LOAD
});

export const FOCUSED_COMMENT_LOADED = "FOCUSED_COMMENT_LOADED";
type FocusedCommentLoadedAction = ActionBase<typeof FOCUSED_COMMENT_LOADED, {
    nodeName: string;
    comment: CommentInfo;
}>;
export const focusedCommentLoaded = (nodeName: string, comment: CommentInfo): FocusedCommentLoadedAction => ({
    type: FOCUSED_COMMENT_LOADED,
    payload: {nodeName, comment}
});

export const FOCUSED_COMMENT_LOAD_FAILED = "FOCUSED_COMMENT_LOAD_FAILED";
type FocusedCommentLoadFailedAction = ActionBase<typeof FOCUSED_COMMENT_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const focusedCommentLoadFailed = (nodeName: string, postingId: string): FocusedCommentLoadFailedAction => ({
    type: FOCUSED_COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENT_COPY_LINK = "COMMENT_COPY_LINK";
type CommentCopyLinkAction = ActionBase<typeof COMMENT_COPY_LINK, {
    id: string;
    postingId: string;
}>;
export const commentCopyLink = (id: string, postingId: string): CommentCopyLinkAction => ({
    type: COMMENT_COPY_LINK,
    payload: {id, postingId}
});

export const OPEN_COMMENT_DIALOG = "OPEN_COMMENT_DIALOG";
type OpenCommentDialogAction = ActionBase<typeof OPEN_COMMENT_DIALOG, {
    commentId: string;
}>;
export const openCommentDialog = (commentId: string): OpenCommentDialogAction => ({
    type: OPEN_COMMENT_DIALOG,
    payload: {commentId}
});

export const CLOSE_COMMENT_DIALOG = "CLOSE_COMMENT_DIALOG";
type CloseCommentDialogAction = ActionBase<typeof CLOSE_COMMENT_DIALOG, never>;
export const closeCommentDialog = (): CloseCommentDialogAction => ({
    type: CLOSE_COMMENT_DIALOG
});

export const COMMENT_DIALOG_COMMENT_LOAD = "COMMENT_DIALOG_COMMENT_LOAD";
type CommentDialogCommentLoadAction = ActionBase<typeof COMMENT_DIALOG_COMMENT_LOAD, never>;
export const commentDialogCommentLoad = (): CommentDialogCommentLoadAction => ({
    type: COMMENT_DIALOG_COMMENT_LOAD
});

export const COMMENT_DIALOG_COMMENT_LOADED = "COMMENT_DIALOG_COMMENT_LOADED";
type CommentDialogCommentLoadedAction = ActionBase<typeof COMMENT_DIALOG_COMMENT_LOADED, {
    comment: CommentInfo;
}>;
export const commentDialogCommentLoaded = (comment: CommentInfo): CommentDialogCommentLoadedAction => ({
    type: COMMENT_DIALOG_COMMENT_LOADED,
    payload: {comment}
});

export const COMMENT_DIALOG_COMMENT_LOAD_FAILED = "COMMENT_DIALOG_COMMENT_LOAD_FAILED";
type CommentDialogCommentLoadFailedAction = ActionBase<typeof COMMENT_DIALOG_COMMENT_LOAD_FAILED, never>;
export const commentDialogCommentLoadFailed = (): CommentDialogCommentLoadFailedAction => ({
    type: COMMENT_DIALOG_COMMENT_LOAD_FAILED
});

export const COMMENT_DIALOG_CONFLICT = "COMMENT_DIALOG_CONFLICT";
type CommentDialogConflictAction = ActionBase<typeof COMMENT_DIALOG_CONFLICT, never>;
export const commentDialogConflict = (): CommentDialogConflictAction => ({
    type: COMMENT_DIALOG_CONFLICT
});

export const COMMENT_DIALOG_CONFLICT_CLOSE = "COMMENT_DIALOG_CONFLICT_CLOSE";
type CommentDialogConflictCloseAction = ActionBase<typeof COMMENT_DIALOG_CONFLICT_CLOSE, never>;
export const commentDialogConflictClose = (): CommentDialogConflictCloseAction => ({
    type: COMMENT_DIALOG_CONFLICT_CLOSE
});

export const COMMENT_VERIFY = "COMMENT_VERIFY";
type CommentVerifyAction = ActionBase<typeof COMMENT_VERIFY, {
    commentId: string;
}>;
export const commentVerify = (commentId: string): CommentVerifyAction => ({
    type: COMMENT_VERIFY,
    payload: {commentId}
});

export const COMMENT_VERIFY_FAILED = "COMMENT_VERIFY_FAILED";
type CommentVerifyFailedAction = ActionBase<typeof COMMENT_VERIFY_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentVerifyFailed = (nodeName: string, postingId: string,
                                    commentId: string): CommentVerifyFailedAction => ({
    type: COMMENT_VERIFY_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_REACT = "COMMENT_REACT";
type CommentReactAction = ActionBase<typeof COMMENT_REACT, {
    id: string;
    negative: boolean;
    emoji: number;
}>;
export const commentReact = (id: string, negative: boolean, emoji: number): CommentReactAction => ({
    type: COMMENT_REACT,
    payload: {id, negative, emoji}
});

export const COMMENT_REACTION_LOAD = "COMMENT_REACTION_LOAD";
type CommentReactionLoadAction = ActionBase<typeof COMMENT_REACTION_LOAD, {
    id: string;
    postingId: string;
}>;
export const commentReactionLoad = (id: string, postingId: string): CommentReactionLoadAction => ({
    type: COMMENT_REACTION_LOAD,
    payload: {id, postingId}
});

export const COMMENT_REACTION_DELETE = "COMMENT_REACTION_DELETE";
type CommentReactionDeleteAction = ActionBase<typeof COMMENT_REACTION_DELETE, {
    id: string;
    postingId: string;
}>;
export const commentReactionDelete = (id: string, postingId: string): CommentReactionDeleteAction => ({
    type: COMMENT_REACTION_DELETE,
    payload: {id, postingId}
});

export const COMMENT_REACTION_SET = "COMMENT_REACTION_SET";
type CommentReactionSetAction = ActionBase<typeof COMMENT_REACTION_SET, {
    nodeName: string;
    id: string;
    postingId: string;
    reaction: ReactionAttributes | null;
    totals: ReactionTotalsInfo;
}>;
export const commentReactionSet = (nodeName: string, id: string, postingId: string, reaction: ReactionAttributes | null,
                                   totals: ReactionTotalsInfo): CommentReactionSetAction => ({
    type: COMMENT_REACTION_SET,
    payload: {nodeName, id, postingId, reaction, totals}
});

export const COMMENT_REPLY = "COMMENT_REPLY";
type CommentReplyAction = ActionBase<typeof COMMENT_REPLY, {
    commentId: string;
    ownerName: string;
    ownerFullName: string | null;
    heading: string;
}>;
export const commentReply = (commentId: string, ownerName: string, ownerFullName: string | null,
                             heading: string): CommentReplyAction => ({
    type: COMMENT_REPLY,
    payload: {commentId, ownerName, ownerFullName, heading}
});

export const COMMENT_REPLIED_TO_SET = "COMMENT_REPLIED_TO_SET";
type CommentRepliedToSetAction = ActionBase<typeof COMMENT_REPLIED_TO_SET, {
    commentId: string;
    ownerName: string;
    ownerFullName: string | null;
    heading: string;
}>;
export const commentRepliedToSet = (commentId: string, ownerName: string, ownerFullName: string | null,
                                    heading: string): CommentRepliedToSetAction => ({
    type: COMMENT_REPLIED_TO_SET,
    payload: {commentId, ownerName, ownerFullName, heading}
});

export const COMMENT_REPLIED_TO_UNSET = "COMMENT_REPLIED_TO_UNSET";
type CommentRepliedToUnsetAction = ActionBase<typeof COMMENT_REPLIED_TO_UNSET, never>;
export const commentRepliedToUnset = (): CommentRepliedToUnsetAction => ({
    type: COMMENT_REPLIED_TO_UNSET
});

export const GLANCE_COMMENT = "GLANCE_COMMENT";
type GlanceCommentAction = ActionBase<typeof GLANCE_COMMENT, {
    commentId: string;
}>;
export const glanceComment = (commentId: string): GlanceCommentAction => ({
    type: GLANCE_COMMENT,
    payload: {commentId}
});

export const GLANCE_COMMENT_LOAD = "GLANCE_COMMENT_LOAD";
type GlanceCommentLoadAction = ActionBase<typeof GLANCE_COMMENT_LOAD, never>;
export const glanceCommentLoad = (): GlanceCommentLoadAction => ({
    type: GLANCE_COMMENT_LOAD
});

export const GLANCE_COMMENT_LOADED = "GLANCE_COMMENT_LOADED";
type GlanceCommentLoadedAction = ActionBase<typeof GLANCE_COMMENT_LOADED, {
    nodeName: string;
    comment: CommentInfo;
}>;
export const glanceCommentLoaded = (nodeName: string, comment: CommentInfo): GlanceCommentLoadedAction => ({
    type: GLANCE_COMMENT_LOADED,
    payload: {nodeName, comment}
});

export const GLANCE_COMMENT_LOAD_FAILED = "GLANCE_COMMENT_LOAD_FAILED";
type GlanceCommentLoadFailedAction = ActionBase<typeof GLANCE_COMMENT_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const glanceCommentLoadFailed = (nodeName: string, postingId: string): GlanceCommentLoadFailedAction => ({
    type: GLANCE_COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export type DetailedPostingAnyAction = DetailedPostingLoadAction
    | DetailedPostingLoadedAction
    | DetailedPostingLoadFailedAction
    | CommentsReceiverSwitchAction
    | CommentsReceiverSwitchedAction
    | CommentsLoadAllAction
    | CommentsPastSliceLoadAction
    | CommentsPastSliceLoadFailedAction
    | CommentsFutureSliceLoadAction
    | CommentsFutureSliceLoadFailedAction
    | CommentsPastSliceSetAction
    | CommentsFutureSliceSetAction
    | CommentsSliceUpdateAction
    | CommentsUpdateAction
    | CommentsUnsetAction
    | CommentsScrollToAnchorAction
    | CommentsScrollToComposerAction
    | CommentsScrolledToAnchorAction
    | CommentsScrolledToCommentsAction
    | CommentsScrolledToComposerAction
    | CommentComposeUnsetAction
    | CommentPostAction
    | CommentPostedAction
    | CommentPostFailedAction
    | CommentSetAction
    | CommentLoadAction
    | CommentLoadFailedAction
    | CommentDeleteAction
    | CommentDeletedAction
    | CommentDeleteFailedAction
    | FocusCommentAction
    | FocusedCommentLoadAction
    | FocusedCommentLoadedAction
    | FocusedCommentLoadFailedAction
    | CommentCopyLinkAction
    | OpenCommentDialogAction
    | CloseCommentDialogAction
    | CommentDialogCommentLoadAction
    | CommentDialogCommentLoadedAction
    | CommentDialogCommentLoadFailedAction
    | CommentDialogConflictAction
    | CommentDialogConflictCloseAction
    | CommentVerifyAction
    | CommentVerifyFailedAction
    | CommentReactAction
    | CommentReactionLoadAction
    | CommentReactionDeleteAction
    | CommentReactionSetAction
    | CommentReplyAction
    | CommentRepliedToSetAction
    | CommentRepliedToUnsetAction
    | GlanceCommentAction
    | GlanceCommentLoadAction
    | GlanceCommentLoadedAction
    | GlanceCommentLoadFailedAction;

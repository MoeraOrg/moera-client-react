import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import {
    BlockedUserInfo,
    CommentInfo,
    CommentSourceText,
    CommentText,
    DraftInfo,
    DraftText,
    Features,
    PostingInfo,
    ReactionAttributes,
    ReactionTotalsInfo
} from "api";

export const DETAILED_POSTING_LOAD = "DETAILED_POSTING_LOAD";
export type DetailedPostingLoadAction = Action<typeof DETAILED_POSTING_LOAD>;
export const detailedPostingLoad = (): DetailedPostingLoadAction => ({
    type: DETAILED_POSTING_LOAD
});

export const DETAILED_POSTING_LOADED = "DETAILED_POSTING_LOADED";
export type DetailedPostingLoadedAction = ActionWithPayload<typeof DETAILED_POSTING_LOADED, {
    posting: PostingInfo;
}>;
export const detailedPostingLoaded = (posting: PostingInfo): DetailedPostingLoadedAction => ({
    type: DETAILED_POSTING_LOADED,
    payload: {posting}
});

export const DETAILED_POSTING_LOAD_FAILED = "DETAILED_POSTING_LOAD_FAILED";
export type DetailedPostingLoadFailedAction = Action<typeof DETAILED_POSTING_LOAD_FAILED>;
export const detailedPostingLoadFailed = (): DetailedPostingLoadFailedAction => ({
    type: DETAILED_POSTING_LOAD_FAILED
});

export const DETAILED_POSTING_LOAD_ATTACHED = "DETAILED_POSTING_LOAD_ATTACHED";
export type DetailedPostingLoadAttachedAction = Action<typeof DETAILED_POSTING_LOAD_ATTACHED>;
export const detailedPostingLoadAttached = (): DetailedPostingLoadAttachedAction => ({
    type: DETAILED_POSTING_LOAD_ATTACHED
});

export const DETAILED_POSTING_LOADED_ATTACHED = "DETAILED_POSTING_LOADED_ATTACHED";
export type DetailedPostingLoadedAttachedAction = Action<typeof DETAILED_POSTING_LOADED_ATTACHED>;
export const detailedPostingLoadedAttached = (): DetailedPostingLoadedAttachedAction => ({
    type: DETAILED_POSTING_LOADED_ATTACHED
});

export const DETAILED_POSTING_SCROLLED_TO_GALLERY = "DETAILED_POSTING_SCROLLED_TO_GALLERY";
export type DetailedPostingScrolledToGalleryAction = Action<typeof DETAILED_POSTING_SCROLLED_TO_GALLERY>;
export const detailedPostingScrolledToGallery = (): DetailedPostingScrolledToGalleryAction => ({
    type: DETAILED_POSTING_SCROLLED_TO_GALLERY
});

export const COMMENTS_RECEIVER_SWITCH = "COMMENTS_RECEIVER_SWITCH";
export type CommentsReceiverSwitchAction = Action<typeof COMMENTS_RECEIVER_SWITCH>;
export const commentsReceiverSwitch = (): CommentsReceiverSwitchAction => ({
    type: COMMENTS_RECEIVER_SWITCH
});

export const COMMENTS_RECEIVER_SWITCHED = "COMMENTS_RECEIVER_SWITCHED";
export type CommentsReceiverSwitchedAction = ActionWithPayload<typeof COMMENTS_RECEIVER_SWITCHED, {
    nodeName: string;
    fullName: string | null;
    postingId: string;
}>;
export const commentsReceiverSwitched = (nodeName: string, fullName: string | null,
                                         postingId: string): CommentsReceiverSwitchedAction => ({
    type: COMMENTS_RECEIVER_SWITCHED,
    payload: {nodeName, fullName, postingId}
});

export const COMMENTS_RECEIVER_FEATURES_LOAD = "COMMENTS_RECEIVER_FEATURES_LOAD";
export type CommentsReceiverFeaturesLoadAction = Action<typeof COMMENTS_RECEIVER_FEATURES_LOAD>;
export const commentsReceiverFeaturesLoad = (): CommentsReceiverFeaturesLoadAction => ({
    type: COMMENTS_RECEIVER_FEATURES_LOAD
});

export const COMMENTS_RECEIVER_FEATURES_LOADED = "COMMENTS_RECEIVER_FEATURES_LOADED";
export type CommentsReceiverFeaturesLoadedAction = ActionWithPayload<typeof COMMENTS_RECEIVER_FEATURES_LOADED, {
    nodeName: string;
    features: Features;
}>;
export const commentsReceiverFeaturesLoaded = (nodeName: string,
                                               features: Features): CommentsReceiverFeaturesLoadedAction => ({
    type: COMMENTS_RECEIVER_FEATURES_LOADED,
    payload: {nodeName, features}
});

export const COMMENTS_LOAD_ALL = "COMMENTS_LOAD_ALL";
export type CommentsLoadAllAction = Action<typeof COMMENTS_LOAD_ALL>;
export const commentsLoadAll = (): CommentsLoadAllAction => ({
    type: COMMENTS_LOAD_ALL
});

export const COMMENTS_PAST_SLICE_LOAD = "COMMENTS_PAST_SLICE_LOAD";
export type CommentsPastSliceLoadAction = Action<typeof COMMENTS_PAST_SLICE_LOAD>;
export const commentsPastSliceLoad = (): CommentsPastSliceLoadAction => ({
    type: COMMENTS_PAST_SLICE_LOAD
});

export const COMMENTS_PAST_SLICE_LOAD_FAILED = "COMMENTS_PAST_SLICE_LOAD_FAILED";
export type CommentsPastSliceLoadFailedAction = ActionWithPayload<typeof COMMENTS_PAST_SLICE_LOAD_FAILED, {
    nodeName: string | null;
    postingId: string | null;
}>;
export const commentsPastSliceLoadFailed = (nodeName: string | null,
                                            postingId: string | null): CommentsPastSliceLoadFailedAction => ({
    type: COMMENTS_PAST_SLICE_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENTS_FUTURE_SLICE_LOAD = "COMMENTS_FUTURE_SLICE_LOAD";
export type CommentsFutureSliceLoadAction = Action<typeof COMMENTS_FUTURE_SLICE_LOAD>;
export const commentsFutureSliceLoad = (): CommentsFutureSliceLoadAction => ({
    type: COMMENTS_FUTURE_SLICE_LOAD
});

export const COMMENTS_FUTURE_SLICE_LOAD_FAILED = "COMMENTS_FUTURE_SLICE_LOAD_FAILED";
export type CommentsFutureSliceLoadFailedAction = ActionWithPayload<typeof COMMENTS_FUTURE_SLICE_LOAD_FAILED, {
    nodeName: string | null;
    postingId: string | null;
}>;
export const commentsFutureSliceLoadFailed = (nodeName: string | null,
                                              postingId: string | null): CommentsFutureSliceLoadFailedAction => ({
    type: COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENTS_PAST_SLICE_SET = "COMMENTS_PAST_SLICE_SET";
export type CommentsPastSliceSetAction = ActionWithPayload<typeof COMMENTS_PAST_SLICE_SET, {
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
export type CommentsFutureSliceSetAction = ActionWithPayload<typeof COMMENTS_FUTURE_SLICE_SET, {
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
export type CommentsSliceUpdateAction = ActionWithPayload<typeof COMMENTS_SLICE_UPDATE, {
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
export type CommentsUpdateAction = Action<typeof COMMENTS_UPDATE>;
export const commentsUpdate = (): CommentsUpdateAction => ({
    type: COMMENTS_UPDATE
});

export const COMMENTS_UNSET = "COMMENTS_UNSET";
export type CommentsUnsetAction = Action<typeof COMMENTS_UNSET>;
export const commentsUnset = (): CommentsUnsetAction => ({
    type: COMMENTS_UNSET
});

export const COMMENTS_SCROLL_TO_ANCHOR = "COMMENTS_SCROLL_TO_ANCHOR";
export type CommentsScrollToAnchorAction = ActionWithPayload<typeof COMMENTS_SCROLL_TO_ANCHOR, {
    anchor: number;
}>;
export const commentsScrollToAnchor = (anchor: number): CommentsScrollToAnchorAction => ({
    type: COMMENTS_SCROLL_TO_ANCHOR,
    payload: {anchor}
});

export const COMMENTS_SCROLL_TO_COMPOSER = "COMMENTS_SCROLL_TO_COMPOSER";
export type CommentsScrollToComposerAction = Action<typeof COMMENTS_SCROLL_TO_COMPOSER>;
export const commentsScrollToComposer = (): CommentsScrollToComposerAction => ({
    type: COMMENTS_SCROLL_TO_COMPOSER
});

export const COMMENTS_SCROLLED_TO_ANCHOR = "COMMENTS_SCROLLED_TO_ANCHOR";
export type CommentsScrolledToAnchorAction = Action<typeof COMMENTS_SCROLLED_TO_ANCHOR>;
export const commentsScrolledToAnchor = (): CommentsScrolledToAnchorAction => ({
    type: COMMENTS_SCROLLED_TO_ANCHOR
});

export const COMMENTS_SCROLLED_TO_COMMENTS = "COMMENTS_SCROLLED_TO_COMMENTS";
export type CommentsScrolledToCommentsAction = Action<typeof COMMENTS_SCROLLED_TO_COMMENTS>;
export const commentsScrolledToComments = (): CommentsScrolledToCommentsAction => ({
    type: COMMENTS_SCROLLED_TO_COMMENTS
});

export const COMMENTS_SCROLLED_TO_COMPOSER = "COMMENTS_SCROLLED_TO_COMPOSER";
export type CommentsScrolledToComposerAction = Action<typeof COMMENTS_SCROLLED_TO_COMPOSER>;
export const commentsScrolledToComposer = (): CommentsScrolledToComposerAction => ({
    type: COMMENTS_SCROLLED_TO_COMPOSER
});

export const COMMENTS_BLOCKED_USERS_LOAD = "COMMENTS_BLOCKED_USERS_LOAD";
export type CommentsBlockedUsersLoadAction = Action<typeof COMMENTS_BLOCKED_USERS_LOAD>;
export const commentsBlockedUsersLoad = (): CommentsBlockedUsersLoadAction => ({
    type: COMMENTS_BLOCKED_USERS_LOAD
});

export const COMMENTS_BLOCKED_USERS_LOADED = "COMMENTS_BLOCKED_USERS_LOADED";
export type CommentsBlockedUsersLoadedAction = ActionWithPayload<typeof COMMENTS_BLOCKED_USERS_LOADED, {
    receiverName: string;
    receiverPostingId: string;
    list: BlockedUserInfo[];
}>;
export const commentsBlockedUsersLoaded = (receiverName: string, receiverPostingId: string,
                                           list: BlockedUserInfo[]): CommentsBlockedUsersLoadedAction => ({
    type: COMMENTS_BLOCKED_USERS_LOADED,
    payload: {receiverName, receiverPostingId, list}
});

export const COMMENTS_BLOCKED_USERS_LOAD_FAILED = "COMMENTS_BLOCKED_USERS_LOAD_FAILED";
export type CommentsBlockedUsersLoadFailedAction = Action<typeof COMMENTS_BLOCKED_USERS_LOAD_FAILED>;
export const commentsBlockedUsersLoadFailed = (): CommentsBlockedUsersLoadFailedAction => ({
    type: COMMENTS_BLOCKED_USERS_LOAD_FAILED
});

export const COMMENTS_SHOW_INVISIBLE_SET = "COMMENTS_SHOW_INVISIBLE_SET";
export type CommentsShowInvisibleSetAction = ActionWithPayload<typeof COMMENTS_SHOW_INVISIBLE_SET, {
    showInvisible: boolean
}>;
export const commentsShowInvisibleSet = (showInvisible: boolean): CommentsShowInvisibleSetAction => ({
    type: COMMENTS_SHOW_INVISIBLE_SET,
    payload: {showInvisible}
});

export const COMMENT_COMPOSE_CANCEL = "COMMENT_COMPOSE_CANCEL";
export type CommentComposeCancelAction = Action<typeof COMMENT_COMPOSE_CANCEL>;
export const commentComposeCancel = (): CommentComposeCancelAction => ({
    type: COMMENT_COMPOSE_CANCEL
});

export const COMMENT_COMPOSE_CANCELLED = "COMMENT_COMPOSE_CANCELLED";
export type CommentComposeCancelledAction = Action<typeof COMMENT_COMPOSE_CANCELLED>;
export const commentComposeCancelled = (): CommentComposeCancelledAction => ({
    type: COMMENT_COMPOSE_CANCELLED
});

export const COMMENT_DRAFT_LOAD = "COMMENT_DRAFT_LOAD";
export type CommentDraftLoadAction = ActionWithPayload<typeof COMMENT_DRAFT_LOAD, {
    isDialog: boolean;
}>;
export const commentDraftLoad = (isDialog: boolean): CommentDraftLoadAction => ({
    type: COMMENT_DRAFT_LOAD,
    payload: {isDialog}
});

export const COMMENT_DRAFT_LOADED = "COMMENT_DRAFT_LOADED";
export type CommentDraftLoadedAction = ActionWithPayload<typeof COMMENT_DRAFT_LOADED, {
    draft: DraftInfo;
}>;
export const commentDraftLoaded = (draft: DraftInfo): CommentDraftLoadedAction => ({
    type: COMMENT_DRAFT_LOADED,
    payload: {draft}
});

export const COMMENT_DRAFT_LOAD_FAILED = "COMMENT_DRAFT_LOAD_FAILED";
export type CommentDraftLoadFailedAction = ActionWithPayload<typeof COMMENT_DRAFT_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const commentDraftLoadFailed = (nodeName: string, postingId: string,
                                       commentId: string | null): CommentDraftLoadFailedAction => ({
    type: COMMENT_DRAFT_LOAD_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DRAFT_ABSENT = "COMMENT_DRAFT_ABSENT";
export type CommentDraftAbsentAction = ActionWithPayload<typeof COMMENT_DRAFT_ABSENT, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const commentDraftAbsent = (nodeName: string, postingId: string,
                                   commentId: string | null): CommentDraftAbsentAction => ({
    type: COMMENT_DRAFT_ABSENT,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DRAFT_SAVE = "COMMENT_DRAFT_SAVE";
export type CommentDraftSaveAction = ActionWithPayload<typeof COMMENT_DRAFT_SAVE, {
    draftId: string | null;
    draftText: DraftText;
    formId: number | null;
}>;
export const commentDraftSave = (draftId: string | null, draftText: DraftText,
                                 formId: number | null): CommentDraftSaveAction => ({
    type: COMMENT_DRAFT_SAVE,
    payload: {draftId, draftText, formId}
});

export const COMMENT_DRAFT_SAVED = "COMMENT_DRAFT_SAVED";
export type CommentDraftSavedAction = ActionWithPayload<typeof COMMENT_DRAFT_SAVED, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
    draft: DraftInfo;
    formId: number | null;
}>;
export const commentDraftSaved = (nodeName: string, postingId: string, commentId: string | null,
                                  draft: DraftInfo, formId: number | null): CommentDraftSavedAction => ({
    type: COMMENT_DRAFT_SAVED,
    payload: {nodeName, postingId, commentId, draft, formId}
});

export const COMMENT_DRAFT_SAVE_FAILED = "COMMENT_DRAFT_SAVE_FAILED";
export type CommentDraftSaveFailedAction = ActionWithPayload<typeof COMMENT_DRAFT_SAVE_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const commentDraftSaveFailed = (nodeName: string, postingId: string,
                                       commentId: string | null): CommentDraftSaveFailedAction => ({
    type: COMMENT_DRAFT_SAVE_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DRAFT_DELETE = "COMMENT_DRAFT_DELETE";
export type CommentDraftDeleteAction = ActionWithPayload<typeof COMMENT_DRAFT_DELETE, {
    draft: DraftInfo;
}>;
export const commentDraftDelete = (draft: DraftInfo): CommentDraftDeleteAction => ({
    type: COMMENT_DRAFT_DELETE,
    payload: {draft}
});

export const COMMENT_DRAFT_DELETED = "COMMENT_DRAFT_DELETED";
export type CommentDraftDeletedAction = ActionWithPayload<typeof COMMENT_DRAFT_DELETED, {
    nodeName: string;
    postingId: string;
}>;
export const commentDraftDeleted = (nodeName: string, postingId: string): CommentDraftDeletedAction => ({
    type: COMMENT_DRAFT_DELETED,
    payload: {nodeName, postingId}
});

export const COMMENT_POST = "COMMENT_POST";
export type CommentPostAction = ActionWithPayload<typeof COMMENT_POST, {
    postingId: string;
    commentId: string | null;
    commentText: CommentText;
    commentSourceText: CommentSourceText;
}>;
export const commentPost = (postingId: string, commentId: string | null, commentText: CommentText,
                            commentSourceText: CommentSourceText): CommentPostAction => ({
    type: COMMENT_POST,
    payload: {postingId, commentId, commentText, commentSourceText}
});

export const COMMENT_POSTED = "COMMENT_POSTED";
export type CommentPostedAction = ActionWithPayload<typeof COMMENT_POSTED, {
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
export type CommentPostFailedAction = ActionWithPayload<typeof COMMENT_POST_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const commentPostFailed = (nodeName: string, postingId: string): CommentPostFailedAction => ({
    type: COMMENT_POST_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENT_SET = "COMMENT_SET";
export type CommentSetAction = ActionWithPayload<typeof COMMENT_SET, {
    nodeName: string;
    comment: CommentInfo;
}>;
export const commentSet = (nodeName: string, comment: CommentInfo): CommentSetAction => ({
    type: COMMENT_SET,
    payload: {nodeName, comment}
});

export const COMMENT_LOAD = "COMMENT_LOAD";
export type CommentLoadAction = ActionWithPayload<typeof COMMENT_LOAD, {
    commentId: string;
}>;
export const commentLoad = (commentId: string): CommentLoadAction => ({
    type: COMMENT_LOAD,
    payload: {commentId}
});

export const COMMENT_LOAD_FAILED = "COMMENT_LOAD_FAILED";
export type CommentLoadFailedAction = ActionWithPayload<typeof COMMENT_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentLoadFailed = (nodeName: string, postingId: string, commentId: string): CommentLoadFailedAction => ({
    type: COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DELETE = "COMMENT_DELETE";
export type CommentDeleteAction = ActionWithPayload<typeof COMMENT_DELETE, {
    commentId: string;
}>;
export const commentDelete = (commentId: string): CommentDeleteAction => ({
    type: COMMENT_DELETE,
    payload: {commentId}
});

export const COMMENT_DELETED = "COMMENT_DELETED";
export type CommentDeletedAction = ActionWithPayload<typeof COMMENT_DELETED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentDeleted = (nodeName: string, postingId: string, commentId: string): CommentDeletedAction => ({
    type: COMMENT_DELETED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_DELETE_FAILED = "COMMENT_DELETE_FAILED";
export type CommentDeleteFailedAction = ActionWithPayload<typeof COMMENT_DELETE_FAILED, {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentDeleteFailed = (nodeName: string, postingId: string,
                                    commentId: string): CommentDeleteFailedAction => ({
    type: COMMENT_DELETE_FAILED,
    payload: {nodeName, postingId, commentId}
});

export const COMMENT_SET_VISIBILITY = "COMMENT_SET_VISIBILITY";
export type CommentSetVisibilityAction = ActionWithPayload<typeof COMMENT_SET_VISIBILITY, {
    commentId: string;
    visible: boolean;
}>;
export const commentSetVisibility = (commentId: string, visible: boolean): CommentSetVisibilityAction => ({
    type: COMMENT_SET_VISIBILITY,
    payload: {commentId, visible}
});

export const FOCUS_COMMENT = "FOCUS_COMMENT";
export type FocusCommentAction = Action<typeof FOCUS_COMMENT>;
export const focusComment = (): FocusCommentAction => ({
    type: FOCUS_COMMENT
});

export const FOCUSED_COMMENT_LOAD = "FOCUSED_COMMENT_LOAD";
export type FocusedCommentLoadAction = Action<typeof FOCUSED_COMMENT_LOAD>;
export const focusedCommentLoad = (): FocusedCommentLoadAction => ({
    type: FOCUSED_COMMENT_LOAD
});

export const FOCUSED_COMMENT_LOADED = "FOCUSED_COMMENT_LOADED";
export type FocusedCommentLoadedAction = ActionWithPayload<typeof FOCUSED_COMMENT_LOADED, {
    nodeName: string;
    comment: CommentInfo;
}>;
export const focusedCommentLoaded = (nodeName: string, comment: CommentInfo): FocusedCommentLoadedAction => ({
    type: FOCUSED_COMMENT_LOADED,
    payload: {nodeName, comment}
});

export const FOCUSED_COMMENT_LOAD_FAILED = "FOCUSED_COMMENT_LOAD_FAILED";
export type FocusedCommentLoadFailedAction = ActionWithPayload<typeof FOCUSED_COMMENT_LOAD_FAILED, {
    nodeName: string;
    postingId: string;
}>;
export const focusedCommentLoadFailed = (nodeName: string, postingId: string): FocusedCommentLoadFailedAction => ({
    type: FOCUSED_COMMENT_LOAD_FAILED,
    payload: {nodeName, postingId}
});

export const COMMENT_COPY_LINK = "COMMENT_COPY_LINK";
export type CommentCopyLinkAction = ActionWithPayload<typeof COMMENT_COPY_LINK, {
    id: string;
    postingId: string;
}>;
export const commentCopyLink = (id: string, postingId: string): CommentCopyLinkAction => ({
    type: COMMENT_COPY_LINK,
    payload: {id, postingId}
});

export const OPEN_COMMENT_DIALOG = "OPEN_COMMENT_DIALOG";
export type OpenCommentDialogAction = ActionWithPayload<typeof OPEN_COMMENT_DIALOG, {
    commentId: string;
}>;
export const openCommentDialog = (commentId: string): OpenCommentDialogAction => ({
    type: OPEN_COMMENT_DIALOG,
    payload: {commentId}
});

export const CLOSE_COMMENT_DIALOG = "CLOSE_COMMENT_DIALOG";
export type CloseCommentDialogAction = Action<typeof CLOSE_COMMENT_DIALOG>;
export const closeCommentDialog = (): CloseCommentDialogAction => ({
    type: CLOSE_COMMENT_DIALOG
});

export const COMMENT_DIALOG_COMMENT_LOAD = "COMMENT_DIALOG_COMMENT_LOAD";
export type CommentDialogCommentLoadAction = Action<typeof COMMENT_DIALOG_COMMENT_LOAD>;
export const commentDialogCommentLoad = (): CommentDialogCommentLoadAction => ({
    type: COMMENT_DIALOG_COMMENT_LOAD
});

export const COMMENT_DIALOG_COMMENT_LOADED = "COMMENT_DIALOG_COMMENT_LOADED";
export type CommentDialogCommentLoadedAction = ActionWithPayload<typeof COMMENT_DIALOG_COMMENT_LOADED, {
    comment: CommentInfo;
}>;
export const commentDialogCommentLoaded = (comment: CommentInfo): CommentDialogCommentLoadedAction => ({
    type: COMMENT_DIALOG_COMMENT_LOADED,
    payload: {comment}
});

export const COMMENT_DIALOG_COMMENT_LOAD_FAILED = "COMMENT_DIALOG_COMMENT_LOAD_FAILED";
export type CommentDialogCommentLoadFailedAction = Action<typeof COMMENT_DIALOG_COMMENT_LOAD_FAILED>;
export const commentDialogCommentLoadFailed = (): CommentDialogCommentLoadFailedAction => ({
    type: COMMENT_DIALOG_COMMENT_LOAD_FAILED
});

export const COMMENT_DIALOG_COMMENT_RESET = "COMMENT_DIALOG_COMMENT_RESET";
export type CommentDialogCommentResetAction = ActionWithPayload<typeof COMMENT_DIALOG_COMMENT_RESET, {
    draftId: string | null;
    closeDialog: boolean;
}>;
export const commentDialogCommentReset = (draftId: string | null,
                                          closeDialog: boolean): CommentDialogCommentResetAction => ({
    type: COMMENT_DIALOG_COMMENT_RESET,
    payload: {draftId, closeDialog}
});

export const COMMENT_DIALOG_CONFLICT = "COMMENT_DIALOG_CONFLICT";
export type CommentDialogConflictAction = Action<typeof COMMENT_DIALOG_CONFLICT>;
export const commentDialogConflict = (): CommentDialogConflictAction => ({
    type: COMMENT_DIALOG_CONFLICT
});

export const COMMENT_DIALOG_CONFLICT_CLOSE = "COMMENT_DIALOG_CONFLICT_CLOSE";
export type CommentDialogConflictCloseAction = Action<typeof COMMENT_DIALOG_CONFLICT_CLOSE>;
export const commentDialogConflictClose = (): CommentDialogConflictCloseAction => ({
    type: COMMENT_DIALOG_CONFLICT_CLOSE
});

export const COMMENT_VERIFY = "COMMENT_VERIFY";
export type CommentVerifyAction = ActionWithPayload<typeof COMMENT_VERIFY, {
    commentId: string;
}>;
export const commentVerify = (commentId: string): CommentVerifyAction => ({
    type: COMMENT_VERIFY,
    payload: {commentId}
});

export const COMMENT_VERIFY_FAILED = "COMMENT_VERIFY_FAILED";
export type CommentVerifyFailedAction = ActionWithPayload<typeof COMMENT_VERIFY_FAILED, {
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
export type CommentReactAction = ActionWithPayload<typeof COMMENT_REACT, {
    id: string;
    negative: boolean;
    emoji: number;
}>;
export const commentReact = (id: string, negative: boolean, emoji: number): CommentReactAction => ({
    type: COMMENT_REACT,
    payload: {id, negative, emoji}
});

export const COMMENT_REACTION_LOAD = "COMMENT_REACTION_LOAD";
export type CommentReactionLoadAction = ActionWithPayload<typeof COMMENT_REACTION_LOAD, {
    id: string;
    postingId: string;
}>;
export const commentReactionLoad = (id: string, postingId: string): CommentReactionLoadAction => ({
    type: COMMENT_REACTION_LOAD,
    payload: {id, postingId}
});

export const COMMENT_REACTION_DELETE = "COMMENT_REACTION_DELETE";
export type CommentReactionDeleteAction = ActionWithPayload<typeof COMMENT_REACTION_DELETE, {
    id: string;
    postingId: string;
}>;
export const commentReactionDelete = (id: string, postingId: string): CommentReactionDeleteAction => ({
    type: COMMENT_REACTION_DELETE,
    payload: {id, postingId}
});

export const COMMENT_REACTION_SET = "COMMENT_REACTION_SET";
export type CommentReactionSetAction = ActionWithPayload<typeof COMMENT_REACTION_SET, {
    nodeName: string;
    id: string;
    postingId: string;
    reaction: ReactionAttributes | null;
    seniorReaction: ReactionAttributes | null;
    totals: ReactionTotalsInfo;
}>;
export const commentReactionSet = (nodeName: string, id: string, postingId: string, reaction: ReactionAttributes | null,
                                   seniorReaction: ReactionAttributes | null,
                                   totals: ReactionTotalsInfo): CommentReactionSetAction => ({
    type: COMMENT_REACTION_SET,
    payload: {nodeName, id, postingId, reaction, seniorReaction, totals}
});

export const COMMENT_REPLY = "COMMENT_REPLY";
export type CommentReplyAction = ActionWithPayload<typeof COMMENT_REPLY, {
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
export type CommentRepliedToSetAction = ActionWithPayload<typeof COMMENT_REPLIED_TO_SET, {
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
export type CommentRepliedToUnsetAction = Action<typeof COMMENT_REPLIED_TO_UNSET>;
export const commentRepliedToUnset = (): CommentRepliedToUnsetAction => ({
    type: COMMENT_REPLIED_TO_UNSET
});

export const GLANCE_COMMENT = "GLANCE_COMMENT";
export type GlanceCommentAction = ActionWithPayload<typeof GLANCE_COMMENT, {
    commentId: string;
}>;
export const glanceComment = (commentId: string): GlanceCommentAction => ({
    type: GLANCE_COMMENT,
    payload: {commentId}
});

export const GLANCE_COMMENT_LOAD = "GLANCE_COMMENT_LOAD";
export type GlanceCommentLoadAction = Action<typeof GLANCE_COMMENT_LOAD>;
export const glanceCommentLoad = (): GlanceCommentLoadAction => ({
    type: GLANCE_COMMENT_LOAD
});

export const GLANCE_COMMENT_LOADED = "GLANCE_COMMENT_LOADED";
export type GlanceCommentLoadedAction = ActionWithPayload<typeof GLANCE_COMMENT_LOADED, {
    nodeName: string;
    comment: CommentInfo;
}>;
export const glanceCommentLoaded = (nodeName: string, comment: CommentInfo): GlanceCommentLoadedAction => ({
    type: GLANCE_COMMENT_LOADED,
    payload: {nodeName, comment}
});

export const GLANCE_COMMENT_LOAD_FAILED = "GLANCE_COMMENT_LOAD_FAILED";
export type GlanceCommentLoadFailedAction = ActionWithPayload<typeof GLANCE_COMMENT_LOAD_FAILED, {
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
    | DetailedPostingLoadAttachedAction
    | DetailedPostingLoadedAttachedAction
    | DetailedPostingScrolledToGalleryAction
    | CommentsReceiverSwitchAction
    | CommentsReceiverSwitchedAction
    | CommentsReceiverFeaturesLoadAction
    | CommentsReceiverFeaturesLoadedAction
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
    | CommentsBlockedUsersLoadAction
    | CommentsBlockedUsersLoadedAction
    | CommentsBlockedUsersLoadFailedAction
    | CommentsShowInvisibleSetAction
    | CommentComposeCancelAction
    | CommentComposeCancelledAction
    | CommentDraftLoadAction
    | CommentDraftLoadedAction
    | CommentDraftLoadFailedAction
    | CommentDraftAbsentAction
    | CommentDraftSaveAction
    | CommentDraftSavedAction
    | CommentDraftSaveFailedAction
    | CommentDraftDeleteAction
    | CommentDraftDeletedAction
    | CommentPostAction
    | CommentPostedAction
    | CommentPostFailedAction
    | CommentSetAction
    | CommentLoadAction
    | CommentLoadFailedAction
    | CommentDeleteAction
    | CommentDeletedAction
    | CommentDeleteFailedAction
    | CommentSetVisibilityAction
    | FocusCommentAction
    | FocusedCommentLoadAction
    | FocusedCommentLoadedAction
    | FocusedCommentLoadFailedAction
    | CommentCopyLinkAction
    | OpenCommentDialogAction
    | CloseCommentDialogAction
    | CommentDialogCommentResetAction
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

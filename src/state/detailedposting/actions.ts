import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
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

export type DetailedPostingLoadAction = ActionWithoutPayload<"DETAILED_POSTING_LOAD">;
export const detailedPostingLoad = (): DetailedPostingLoadAction =>
    actionWithoutPayload("DETAILED_POSTING_LOAD");

export type DetailedPostingLoadedAction = ActionWithPayload<"DETAILED_POSTING_LOADED", {
    posting: PostingInfo;
}>;
export const detailedPostingLoaded = (posting: PostingInfo): DetailedPostingLoadedAction =>
    actionWithPayload("DETAILED_POSTING_LOADED", {posting});

export type DetailedPostingLoadFailedAction = ActionWithoutPayload<"DETAILED_POSTING_LOAD_FAILED">;
export const detailedPostingLoadFailed = (): DetailedPostingLoadFailedAction =>
    actionWithoutPayload("DETAILED_POSTING_LOAD_FAILED");

export type DetailedPostingLoadAttachedAction = ActionWithoutPayload<"DETAILED_POSTING_LOAD_ATTACHED">;
export const detailedPostingLoadAttached = (): DetailedPostingLoadAttachedAction =>
    actionWithoutPayload("DETAILED_POSTING_LOAD_ATTACHED");

export type DetailedPostingLoadedAttachedAction = ActionWithoutPayload<"DETAILED_POSTING_LOADED_ATTACHED">;
export const detailedPostingLoadedAttached = (): DetailedPostingLoadedAttachedAction =>
    actionWithoutPayload("DETAILED_POSTING_LOADED_ATTACHED");

export type DetailedPostingScrolledToGalleryAction = ActionWithoutPayload<"DETAILED_POSTING_SCROLLED_TO_GALLERY">;
export const detailedPostingScrolledToGallery = (): DetailedPostingScrolledToGalleryAction =>
    actionWithoutPayload("DETAILED_POSTING_SCROLLED_TO_GALLERY");

export type CommentsReceiverSwitchAction = ActionWithoutPayload<"COMMENTS_RECEIVER_SWITCH">;
export const commentsReceiverSwitch = (): CommentsReceiverSwitchAction =>
    actionWithoutPayload("COMMENTS_RECEIVER_SWITCH");

export type CommentsReceiverSwitchedAction = ActionWithPayload<"COMMENTS_RECEIVER_SWITCHED", {
    nodeName: string;
    fullName: string | null;
    postingId: string;
}>;
export const commentsReceiverSwitched = (
    nodeName: string, fullName: string | null, postingId: string
): CommentsReceiverSwitchedAction =>
    actionWithPayload("COMMENTS_RECEIVER_SWITCHED", {nodeName, fullName, postingId});

export type CommentsReceiverFeaturesLoadAction = ActionWithoutPayload<"COMMENTS_RECEIVER_FEATURES_LOAD">;
export const commentsReceiverFeaturesLoad = (): CommentsReceiverFeaturesLoadAction =>
    actionWithoutPayload("COMMENTS_RECEIVER_FEATURES_LOAD");

export type CommentsReceiverFeaturesLoadedAction = ActionWithPayload<"COMMENTS_RECEIVER_FEATURES_LOADED", {
    nodeName: string;
    features: Features;
}>;
export const commentsReceiverFeaturesLoaded = (
    nodeName: string, features: Features
): CommentsReceiverFeaturesLoadedAction =>
    actionWithPayload("COMMENTS_RECEIVER_FEATURES_LOADED", {nodeName, features});

export type CommentsLoadAllAction = ActionWithoutPayload<"COMMENTS_LOAD_ALL">;
export const commentsLoadAll = (): CommentsLoadAllAction =>
    actionWithoutPayload("COMMENTS_LOAD_ALL");

export type CommentsPastSliceLoadAction = ActionWithPayload<"COMMENTS_PAST_SLICE_LOAD", {
    anchor: number | null;
}>;
export const commentsPastSliceLoad = (anchor: number | null): CommentsPastSliceLoadAction =>
    actionWithPayload("COMMENTS_PAST_SLICE_LOAD", {anchor});

export type CommentsPastSliceLoadFailedAction = ActionWithPayload<"COMMENTS_PAST_SLICE_LOAD_FAILED", {
    nodeName: string | null;
    postingId: string | null;
}>;
export const commentsPastSliceLoadFailed = (
    nodeName: string | null, postingId: string | null
): CommentsPastSliceLoadFailedAction =>
    actionWithPayload("COMMENTS_PAST_SLICE_LOAD_FAILED", {nodeName, postingId});

export type CommentsFutureSliceLoadAction = ActionWithPayload<"COMMENTS_FUTURE_SLICE_LOAD", {
    anchor: number | null;
}>;
export const commentsFutureSliceLoad = (anchor: number | null): CommentsFutureSliceLoadAction =>
    actionWithPayload("COMMENTS_FUTURE_SLICE_LOAD", {anchor});

export type CommentsFutureSliceLoadFailedAction = ActionWithPayload<"COMMENTS_FUTURE_SLICE_LOAD_FAILED", {
    nodeName: string | null;
    postingId: string | null;
}>;
export const commentsFutureSliceLoadFailed = (
    nodeName: string | null, postingId: string | null
): CommentsFutureSliceLoadFailedAction =>
    actionWithPayload("COMMENTS_FUTURE_SLICE_LOAD_FAILED", {nodeName, postingId});

export type CommentsPastSliceSetAction = ActionWithPayload<"COMMENTS_PAST_SLICE_SET", {
    nodeName: string;
    postingId: string;
    comments: CommentInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
    anchor: number | null;
}>;
export const commentsPastSliceSet = (
    nodeName: string, postingId: string, comments: CommentInfo[], before: number, after: number, total: number,
    totalInPast: number, totalInFuture: number, anchor: number | null
): CommentsPastSliceSetAction =>
    actionWithPayload(
        "COMMENTS_PAST_SLICE_SET",
        {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture, anchor}
    );

export type CommentsFutureSliceSetAction = ActionWithPayload<"COMMENTS_FUTURE_SLICE_SET", {
    nodeName: string;
    postingId: string;
    comments: CommentInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
    anchor: number | null;
}>;
export const commentsFutureSliceSet = (
    nodeName: string, postingId: string, comments: CommentInfo[], before: number, after: number, total: number,
    totalInPast: number, totalInFuture: number, anchor: number | null
): CommentsFutureSliceSetAction =>
    actionWithPayload(
        "COMMENTS_FUTURE_SLICE_SET",
        {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture, anchor}
    );

export type CommentsSliceUpdateAction = ActionWithPayload<"COMMENTS_SLICE_UPDATE", {
    nodeName: string;
    postingId: string;
    comments: CommentInfo[];
    before: number;
    after: number;
    total: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const commentsSliceUpdate = (
    nodeName: string, postingId: string, comments: CommentInfo[], before: number, after: number, total: number,
    totalInPast: number, totalInFuture: number
): CommentsSliceUpdateAction =>
    actionWithPayload(
        "COMMENTS_SLICE_UPDATE",
        {nodeName, postingId, comments, before, after, total, totalInPast, totalInFuture}
    );

export type CommentsUpdateAction = ActionWithoutPayload<"COMMENTS_UPDATE">;
export const commentsUpdate = (): CommentsUpdateAction =>
    actionWithoutPayload("COMMENTS_UPDATE");

export type CommentsUnsetAction = ActionWithoutPayload<"COMMENTS_UNSET">;
export const commentsUnset = (): CommentsUnsetAction =>
    actionWithoutPayload("COMMENTS_UNSET");

export type CommentsScrollToAnchorAction = ActionWithPayload<"COMMENTS_SCROLL_TO_ANCHOR", {
    anchor: number;
}>;
export const commentsScrollToAnchor = (anchor: number): CommentsScrollToAnchorAction =>
    actionWithPayload("COMMENTS_SCROLL_TO_ANCHOR", {anchor});

export type CommentsScrollToComposerAction = ActionWithoutPayload<"COMMENTS_SCROLL_TO_COMPOSER">;
export const commentsScrollToComposer = (): CommentsScrollToComposerAction =>
    actionWithoutPayload("COMMENTS_SCROLL_TO_COMPOSER");

export type CommentsScrolledToAnchorAction = ActionWithoutPayload<"COMMENTS_SCROLLED_TO_ANCHOR">;
export const commentsScrolledToAnchor = (): CommentsScrolledToAnchorAction =>
    actionWithoutPayload("COMMENTS_SCROLLED_TO_ANCHOR");

export type CommentsScrolledToCommentsAction = ActionWithoutPayload<"COMMENTS_SCROLLED_TO_COMMENTS">;
export const commentsScrolledToComments = (): CommentsScrolledToCommentsAction =>
    actionWithoutPayload("COMMENTS_SCROLLED_TO_COMMENTS");

export type CommentsScrolledToComposerAction = ActionWithoutPayload<"COMMENTS_SCROLLED_TO_COMPOSER">;
export const commentsScrolledToComposer = (): CommentsScrolledToComposerAction =>
    actionWithoutPayload("COMMENTS_SCROLLED_TO_COMPOSER");

export type CommentsBlockedUsersLoadAction = ActionWithoutPayload<"COMMENTS_BLOCKED_USERS_LOAD">;
export const commentsBlockedUsersLoad = (): CommentsBlockedUsersLoadAction =>
    actionWithoutPayload("COMMENTS_BLOCKED_USERS_LOAD");

export type CommentsBlockedUsersLoadedAction = ActionWithPayload<"COMMENTS_BLOCKED_USERS_LOADED", {
    receiverName: string;
    receiverPostingId: string;
    list: BlockedUserInfo[];
}>;
export const commentsBlockedUsersLoaded = (
    receiverName: string, receiverPostingId: string, list: BlockedUserInfo[]
): CommentsBlockedUsersLoadedAction =>
    actionWithPayload("COMMENTS_BLOCKED_USERS_LOADED", {receiverName, receiverPostingId, list});

export type CommentsBlockedUsersLoadFailedAction = ActionWithoutPayload<"COMMENTS_BLOCKED_USERS_LOAD_FAILED">;
export const commentsBlockedUsersLoadFailed = (): CommentsBlockedUsersLoadFailedAction =>
    actionWithoutPayload("COMMENTS_BLOCKED_USERS_LOAD_FAILED");

export type CommentsShowInvisibleSetAction = ActionWithPayload<"COMMENTS_SHOW_INVISIBLE_SET", {
    showInvisible: boolean
}>;
export const commentsShowInvisibleSet = (showInvisible: boolean): CommentsShowInvisibleSetAction =>
    actionWithPayload("COMMENTS_SHOW_INVISIBLE_SET", {showInvisible});

export type CommentComposeCancelAction = ActionWithoutPayload<"COMMENT_COMPOSE_CANCEL">;
export const commentComposeCancel = (): CommentComposeCancelAction =>
    actionWithoutPayload("COMMENT_COMPOSE_CANCEL");

export type CommentComposeCancelledAction = ActionWithoutPayload<"COMMENT_COMPOSE_CANCELLED">;
export const commentComposeCancelled = (): CommentComposeCancelledAction =>
    actionWithoutPayload("COMMENT_COMPOSE_CANCELLED");

export type CommentDraftLoadAction = ActionWithPayload<"COMMENT_DRAFT_LOAD", {
    isDialog: boolean;
}>;
export const commentDraftLoad = (isDialog: boolean): CommentDraftLoadAction =>
    actionWithPayload("COMMENT_DRAFT_LOAD", {isDialog});

export type CommentDraftLoadedAction = ActionWithPayload<"COMMENT_DRAFT_LOADED", {
    draft: DraftInfo;
}>;
export const commentDraftLoaded = (draft: DraftInfo): CommentDraftLoadedAction =>
    actionWithPayload("COMMENT_DRAFT_LOADED", {draft});

export type CommentDraftLoadFailedAction = ActionWithPayload<"COMMENT_DRAFT_LOAD_FAILED", {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const commentDraftLoadFailed = (
    nodeName: string, postingId: string, commentId: string | null
): CommentDraftLoadFailedAction =>
    actionWithPayload("COMMENT_DRAFT_LOAD_FAILED", {nodeName, postingId, commentId});

export type CommentDraftAbsentAction = ActionWithPayload<"COMMENT_DRAFT_ABSENT", {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const commentDraftAbsent = (
    nodeName: string, postingId: string, commentId: string | null
): CommentDraftAbsentAction =>
    actionWithPayload("COMMENT_DRAFT_ABSENT", {nodeName, postingId, commentId});

export type CommentDraftSaveAction = ActionWithPayload<"COMMENT_DRAFT_SAVE", {
    draftId: string | null;
    draftText: DraftText;
    formId: number | null;
}>;
export const commentDraftSave = (
    draftId: string | null, draftText: DraftText, formId: number | null
): CommentDraftSaveAction =>
    actionWithPayload("COMMENT_DRAFT_SAVE", {draftId, draftText, formId});

export type CommentDraftSavedAction = ActionWithPayload<"COMMENT_DRAFT_SAVED", {
    nodeName: string;
    postingId: string;
    commentId: string | null;
    draft: DraftInfo;
    formId: number | null;
}>;
export const commentDraftSaved = (
    nodeName: string, postingId: string, commentId: string | null, draft: DraftInfo, formId: number | null
): CommentDraftSavedAction =>
    actionWithPayload("COMMENT_DRAFT_SAVED", {nodeName, postingId, commentId, draft, formId});

export type CommentDraftSaveFailedAction = ActionWithPayload<"COMMENT_DRAFT_SAVE_FAILED", {
    nodeName: string;
    postingId: string;
    commentId: string | null;
}>;
export const commentDraftSaveFailed = (
    nodeName: string, postingId: string, commentId: string | null
): CommentDraftSaveFailedAction =>
    actionWithPayload("COMMENT_DRAFT_SAVE_FAILED", {nodeName, postingId, commentId});

export type CommentDraftDeleteAction = ActionWithPayload<"COMMENT_DRAFT_DELETE", {
    draft: DraftInfo;
}>;
export const commentDraftDelete = (draft: DraftInfo): CommentDraftDeleteAction =>
    actionWithPayload("COMMENT_DRAFT_DELETE", {draft});

export type CommentDraftDeletedAction = ActionWithPayload<"COMMENT_DRAFT_DELETED", {
    nodeName: string;
    postingId: string;
}>;
export const commentDraftDeleted = (nodeName: string, postingId: string): CommentDraftDeletedAction =>
    actionWithPayload("COMMENT_DRAFT_DELETED", {nodeName, postingId});

export type CommentPostAction = ActionWithPayload<"COMMENT_POST", {
    postingId: string;
    commentId: string | null;
    commentText: CommentText;
    commentSourceText: CommentSourceText;
}>;
export const commentPost = (
    postingId: string, commentId: string | null, commentText: CommentText, commentSourceText: CommentSourceText
): CommentPostAction =>
    actionWithPayload("COMMENT_POST", {postingId, commentId, commentText, commentSourceText});

export type CommentPostedAction = ActionWithPayload<"COMMENT_POSTED", {
    nodeName: string;
    postingId: string;
    commentId: string;
    moment: number;
}>;
export const commentPosted = (
    nodeName: string, postingId: string, commentId: string, moment: number
): CommentPostedAction =>
    actionWithPayload("COMMENT_POSTED", {nodeName, postingId, commentId, moment});

export type CommentPostFailedAction = ActionWithPayload<"COMMENT_POST_FAILED", {
    nodeName: string;
    postingId: string;
}>;
export const commentPostFailed = (nodeName: string, postingId: string): CommentPostFailedAction =>
    actionWithPayload("COMMENT_POST_FAILED", {nodeName, postingId});

export type CommentSetAction = ActionWithPayload<"COMMENT_SET", {
    nodeName: string;
    comment: CommentInfo;
}>;
export const commentSet = (nodeName: string, comment: CommentInfo): CommentSetAction =>
    actionWithPayload("COMMENT_SET", {nodeName, comment});

export type CommentLoadAction = ActionWithPayload<"COMMENT_LOAD", {
    commentId: string;
}>;
export const commentLoad = (commentId: string): CommentLoadAction =>
    actionWithPayload("COMMENT_LOAD", {commentId});

export type CommentLoadFailedAction = ActionWithPayload<"COMMENT_LOAD_FAILED", {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentLoadFailed = (nodeName: string, postingId: string, commentId: string): CommentLoadFailedAction =>
    actionWithPayload("COMMENT_LOAD_FAILED", {nodeName, postingId, commentId});

export type CommentDeleteAction = ActionWithPayload<"COMMENT_DELETE", {
    commentId: string;
}>;
export const commentDelete = (commentId: string): CommentDeleteAction =>
    actionWithPayload("COMMENT_DELETE", {commentId});

export type CommentDeletedAction = ActionWithPayload<"COMMENT_DELETED", {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentDeleted = (nodeName: string, postingId: string, commentId: string): CommentDeletedAction =>
    actionWithPayload("COMMENT_DELETED", {nodeName, postingId, commentId});

export type CommentDeleteFailedAction = ActionWithPayload<"COMMENT_DELETE_FAILED", {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentDeleteFailed = (
    nodeName: string, postingId: string, commentId: string
): CommentDeleteFailedAction =>
    actionWithPayload("COMMENT_DELETE_FAILED", {nodeName, postingId, commentId});

export type CommentSetVisibilityAction = ActionWithPayload<"COMMENT_SET_VISIBILITY", {
    commentId: string;
    visible: boolean;
}>;
export const commentSetVisibility = (commentId: string, visible: boolean): CommentSetVisibilityAction =>
    actionWithPayload("COMMENT_SET_VISIBILITY", {commentId, visible});

export type FocusCommentAction = ActionWithoutPayload<"FOCUS_COMMENT">;
export const focusComment = (): FocusCommentAction =>
    actionWithoutPayload("FOCUS_COMMENT");

export type FocusedCommentLoadAction = ActionWithoutPayload<"FOCUSED_COMMENT_LOAD">;
export const focusedCommentLoad = (): FocusedCommentLoadAction =>
    actionWithoutPayload("FOCUSED_COMMENT_LOAD");

export type FocusedCommentLoadedAction = ActionWithPayload<"FOCUSED_COMMENT_LOADED", {
    nodeName: string;
    comment: CommentInfo;
}>;
export const focusedCommentLoaded = (nodeName: string, comment: CommentInfo): FocusedCommentLoadedAction =>
    actionWithPayload("FOCUSED_COMMENT_LOADED", {nodeName, comment});

export type FocusedCommentLoadFailedAction = ActionWithPayload<"FOCUSED_COMMENT_LOAD_FAILED", {
    nodeName: string;
    postingId: string;
}>;
export const focusedCommentLoadFailed = (nodeName: string, postingId: string): FocusedCommentLoadFailedAction =>
    actionWithPayload("FOCUSED_COMMENT_LOAD_FAILED", {nodeName, postingId});

export type CommentCopyLinkAction = ActionWithPayload<"COMMENT_COPY_LINK", {
    id: string;
    postingId: string;
}>;
export const commentCopyLink = (id: string, postingId: string): CommentCopyLinkAction =>
    actionWithPayload("COMMENT_COPY_LINK", {id, postingId});

export type OpenCommentDialogAction = ActionWithPayload<"OPEN_COMMENT_DIALOG", {
    commentId: string;
}>;
export const openCommentDialog = (commentId: string): OpenCommentDialogAction =>
    actionWithPayload("OPEN_COMMENT_DIALOG", {commentId});

export type CloseCommentDialogAction = ActionWithoutPayload<"CLOSE_COMMENT_DIALOG">;
export const closeCommentDialog = (): CloseCommentDialogAction =>
    actionWithoutPayload("CLOSE_COMMENT_DIALOG");

export type CommentDialogCommentLoadAction = ActionWithoutPayload<"COMMENT_DIALOG_COMMENT_LOAD">;
export const commentDialogCommentLoad = (): CommentDialogCommentLoadAction =>
    actionWithoutPayload("COMMENT_DIALOG_COMMENT_LOAD");

export type CommentDialogCommentLoadedAction = ActionWithPayload<"COMMENT_DIALOG_COMMENT_LOADED", {
    comment: CommentInfo;
}>;
export const commentDialogCommentLoaded = (comment: CommentInfo): CommentDialogCommentLoadedAction =>
    actionWithPayload("COMMENT_DIALOG_COMMENT_LOADED", {comment});

export type CommentDialogCommentLoadFailedAction = ActionWithoutPayload<"COMMENT_DIALOG_COMMENT_LOAD_FAILED">;
export const commentDialogCommentLoadFailed = (): CommentDialogCommentLoadFailedAction =>
    actionWithoutPayload("COMMENT_DIALOG_COMMENT_LOAD_FAILED");

export type CommentDialogCommentResetAction = ActionWithPayload<"COMMENT_DIALOG_COMMENT_RESET", {
    draftId: string | null;
    closeDialog: boolean;
}>;
export const commentDialogCommentReset = (
    draftId: string | null, closeDialog: boolean
): CommentDialogCommentResetAction =>
    actionWithPayload("COMMENT_DIALOG_COMMENT_RESET", {draftId, closeDialog});

export type CommentDialogConflictAction = ActionWithoutPayload<"COMMENT_DIALOG_CONFLICT">;
export const commentDialogConflict = (): CommentDialogConflictAction =>
    actionWithoutPayload("COMMENT_DIALOG_CONFLICT");

export type CommentDialogConflictCloseAction = ActionWithoutPayload<"COMMENT_DIALOG_CONFLICT_CLOSE">;
export const commentDialogConflictClose = (): CommentDialogConflictCloseAction =>
    actionWithoutPayload("COMMENT_DIALOG_CONFLICT_CLOSE");

export type CommentVerifyAction = ActionWithPayload<"COMMENT_VERIFY", {
    commentId: string;
}>;
export const commentVerify = (commentId: string): CommentVerifyAction =>
    actionWithPayload("COMMENT_VERIFY", {commentId});

export type CommentVerifyFailedAction = ActionWithPayload<"COMMENT_VERIFY_FAILED", {
    nodeName: string;
    postingId: string;
    commentId: string;
}>;
export const commentVerifyFailed = (
    nodeName: string, postingId: string, commentId: string
): CommentVerifyFailedAction =>
    actionWithPayload("COMMENT_VERIFY_FAILED", {nodeName, postingId, commentId});

export type CommentReactAction = ActionWithPayload<"COMMENT_REACT", {
    id: string;
    negative: boolean;
    emoji: number;
}>;
export const commentReact = (id: string, negative: boolean, emoji: number): CommentReactAction =>
    actionWithPayload("COMMENT_REACT", {id, negative, emoji});

export type CommentReactionLoadAction = ActionWithPayload<"COMMENT_REACTION_LOAD", {
    id: string;
    postingId: string;
}>;
export const commentReactionLoad = (id: string, postingId: string): CommentReactionLoadAction =>
    actionWithPayload("COMMENT_REACTION_LOAD", {id, postingId});

export type CommentReactionDeleteAction = ActionWithPayload<"COMMENT_REACTION_DELETE", {
    id: string;
    postingId: string;
}>;
export const commentReactionDelete = (id: string, postingId: string): CommentReactionDeleteAction =>
    actionWithPayload("COMMENT_REACTION_DELETE", {id, postingId});

export type CommentReactionSetAction = ActionWithPayload<"COMMENT_REACTION_SET", {
    nodeName: string;
    id: string;
    postingId: string;
    reaction: ReactionAttributes | null;
    seniorReaction: ReactionAttributes | null;
    totals: ReactionTotalsInfo;
}>;
export const commentReactionSet = (
    nodeName: string, id: string, postingId: string, reaction: ReactionAttributes | null,
    seniorReaction: ReactionAttributes | null, totals: ReactionTotalsInfo
): CommentReactionSetAction =>
    actionWithPayload("COMMENT_REACTION_SET", {nodeName, id, postingId, reaction, seniorReaction, totals});

export type CommentReplyAction = ActionWithPayload<"COMMENT_REPLY", {
    commentId: string;
    ownerName: string;
    ownerFullName: string | null;
    heading: string;
}>;
export const commentReply = (
    commentId: string, ownerName: string, ownerFullName: string | null, heading: string
): CommentReplyAction =>
    actionWithPayload("COMMENT_REPLY", {commentId, ownerName, ownerFullName, heading});

export type CommentRepliedToSetAction = ActionWithPayload<"COMMENT_REPLIED_TO_SET", {
    commentId: string;
    ownerName: string;
    ownerFullName: string | null;
    heading: string;
}>;
export const commentRepliedToSet = (
    commentId: string, ownerName: string, ownerFullName: string | null, heading: string
): CommentRepliedToSetAction =>
    actionWithPayload("COMMENT_REPLIED_TO_SET", {commentId, ownerName, ownerFullName, heading});

export type CommentRepliedToUnsetAction = ActionWithoutPayload<"COMMENT_REPLIED_TO_UNSET">;
export const commentRepliedToUnset = (): CommentRepliedToUnsetAction =>
    actionWithoutPayload("COMMENT_REPLIED_TO_UNSET");

export type GlanceCommentAction = ActionWithPayload<"GLANCE_COMMENT", {
    commentId: string;
}>;
export const glanceComment = (commentId: string): GlanceCommentAction =>
    actionWithPayload("GLANCE_COMMENT", {commentId});

export type GlanceCommentLoadAction = ActionWithoutPayload<"GLANCE_COMMENT_LOAD">;
export const glanceCommentLoad = (): GlanceCommentLoadAction =>
    actionWithoutPayload("GLANCE_COMMENT_LOAD");

export type GlanceCommentLoadedAction = ActionWithPayload<"GLANCE_COMMENT_LOADED", {
    nodeName: string;
    comment: CommentInfo;
}>;
export const glanceCommentLoaded = (nodeName: string, comment: CommentInfo): GlanceCommentLoadedAction =>
    actionWithPayload("GLANCE_COMMENT_LOADED", {nodeName, comment});

export type GlanceCommentLoadFailedAction = ActionWithPayload<"GLANCE_COMMENT_LOAD_FAILED", {
    nodeName: string;
    postingId: string;
}>;
export const glanceCommentLoadFailed = (nodeName: string, postingId: string): GlanceCommentLoadFailedAction =>
    actionWithPayload("GLANCE_COMMENT_LOAD_FAILED", {nodeName, postingId});

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

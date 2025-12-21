import { conj, inv, trigger } from "state/trigger";
import { bottomMenuShow, goToLocation, updateLocation } from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import {
    commentDialogCommentLoad,
    commentDialogCommentReset,
    commentDialogConflict,
    commentDraftDelete,
    commentDraftLoad,
    CommentDraftSavedAction,
    commentLoad,
    CommentPostedAction,
    commentReactionLoad,
    commentsBlockedUsersLoad,
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsReceiverFeaturesLoad,
    commentsReceiverSwitch,
    commentsScrollToAnchor,
    CommentsScrollToAnchorAction,
    commentsUnset,
    commentsUpdate,
    detailedPostingLoad,
    detailedPostingLoadAttached,
    DetailedPostingLoadedAction,
    focusComment,
    focusedCommentLoad,
    FocusedCommentLoadedAction,
    glanceCommentLoad
} from "state/detailedposting/actions";
import {
    getCommentDialogCommentId,
    getCommentsReceiverPostingId,
    isCommentComposeDraftToBeLoaded,
    isCommentDialogDraftToBeLoaded,
    isCommentDialogShown,
    isCommentMomentInLoadedRange,
    isCommentPosted,
    isCommentsBlockedUsersToBeLoaded,
    isCommentsReceiverFeaturesToBeLoaded,
    isCommentsReceiverPostingId,
    isCommentsReceiverToBeSwitched,
    isDetailedPostingDefined,
    isDetailedPostingGalleryExpanded,
    isDetailedPostingId,
    isDetailedPostingToBeLoaded,
    isFocusedCommentInList,
    isFocusedCommentToBeLoaded,
    isFutureCommentsToBeLoaded,
    isGlanceCommentToBeLoaded,
    isPastCommentsToBeLoaded
} from "state/detailedposting/selectors";
import { PostingDeletedAction, postingSet, PostingSetAction } from "state/postings/actions";
import { getPostingMoment } from "state/postings/selectors";
import { isAtNode } from "state/node/selectors";
import { CommentAddedEvent, CommentReactionsChangedEvent, CommentUpdatedEvent, EventAction } from "api/events";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    trigger("GO_TO_PAGE", conj(isAtDetailedPostingPage, isDetailedPostingToBeLoaded), detailedPostingLoad),
    trigger(["HOME_READY", "WAKE_UP"], isDetailedPostingDefined, detailedPostingLoad),
    trigger("WAKE_UP", isAtDetailedPostingPage, commentsUpdate),
    trigger("WAKE_UP", inv(isAtDetailedPostingPage), commentsUnset),
    trigger(
        "DETAILED_POSTING_LOADED",
        true,
        (signal: DetailedPostingLoadedAction) => postingSet(signal.payload.posting, REL_CURRENT)
    ),
    trigger(
        "POSTING_SET",
        (state, signal: PostingSetAction) =>
            isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.posting.id),
        updateLocation
    ),
    trigger(
        "GO_TO_PAGE",
        conj(isAtDetailedPostingPage, isDetailedPostingGalleryExpanded),
        detailedPostingLoadAttached
    ),
    trigger(
        ["GO_TO_PAGE", "POSTING_SET", "NODE_READY"],
        conj(isAtNode, isAtDetailedPostingPage, isCommentsReceiverToBeSwitched),
        commentsReceiverSwitch
    ),
    trigger(
        ["GO_TO_PAGE", "COMMENTS_RECEIVER_SWITCHED", "HOME_READY"],
        conj(isAtDetailedPostingPage, isCommentsReceiverFeaturesToBeLoaded),
        commentsReceiverFeaturesLoad
    ),
    trigger(
        ["GO_TO_PAGE", "COMMENTS_RECEIVER_SWITCHED", "HOME_READY"],
        conj(isAtDetailedPostingPage, isCommentComposeDraftToBeLoaded),
        commentDraftLoad(false)
    ),
    trigger("DETAILED_POSTING_EXPAND_GALLERY", true, updateLocation),
    trigger(
        "OPEN_COMMENT_DIALOG",
        conj(isAtDetailedPostingPage, isCommentDialogDraftToBeLoaded),
        commentDraftLoad(true)
    ),
    trigger(
        ["GO_TO_PAGE", "POSTING_SET", "COMMENTS_RECEIVER_SWITCHED", "COMMENTS_UNSET"],
        conj(isAtDetailedPostingPage, isFocusedCommentToBeLoaded, isFocusedCommentInList),
        focusComment
    ),
    trigger(
        ["GO_TO_PAGE", "POSTING_SET", "COMMENTS_RECEIVER_SWITCHED", "COMMENTS_UNSET"],
        conj(isAtDetailedPostingPage, isFocusedCommentToBeLoaded, inv(isFocusedCommentInList)),
        focusedCommentLoad
    ),
    trigger(
        ["GO_TO_PAGE", "COMMENTS_RECEIVER_SWITCHED", "COMMENTS_UNSET", "FOCUSED_COMMENT_LOAD_FAILED"],
        conj(isAtDetailedPostingPage, isFutureCommentsToBeLoaded),
        commentsFutureSliceLoad(null)
    ),
    trigger(
        "FOCUSED_COMMENT_LOADED",
        conj(isAtDetailedPostingPage, isFutureCommentsToBeLoaded),
        (signal: FocusedCommentLoadedAction) => commentsFutureSliceLoad(signal.payload.comment.moment)
    ),
    trigger(
        "COMMENTS_SCROLL_TO_ANCHOR",
        conj(isAtDetailedPostingPage, isFutureCommentsToBeLoaded),
        (signal: CommentsScrollToAnchorAction) => commentsFutureSliceLoad(signal.payload.anchor)
    ),
    trigger(
        ["GO_TO_PAGE", "COMMENTS_RECEIVER_SWITCHED", "COMMENTS_UNSET", "FOCUSED_COMMENT_LOAD_FAILED"],
        conj(isAtDetailedPostingPage, isPastCommentsToBeLoaded),
        commentsPastSliceLoad(null)
    ),
    trigger(
        "FOCUSED_COMMENT_LOADED",
        conj(isAtDetailedPostingPage, isPastCommentsToBeLoaded),
        (signal: FocusedCommentLoadedAction) => commentsPastSliceLoad(signal.payload.comment.moment)
    ),
    trigger(
        "COMMENTS_SCROLL_TO_ANCHOR",
        conj(isAtDetailedPostingPage, isPastCommentsToBeLoaded),
        (signal: CommentsScrollToAnchorAction) => commentsPastSliceLoad(signal.payload.anchor)
    ),
    trigger(
        ["GO_TO_PAGE", "COMMENTS_RECEIVER_SWITCHED", "HOME_READY"],
        conj(isAtDetailedPostingPage, isCommentsBlockedUsersToBeLoaded),
        commentsBlockedUsersLoad
    ),
    trigger(
        "POSTING_DELETED",
        (state, signal: PostingDeletedAction) =>
            isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.id),
        signal => goToLocation(`/timeline?before=${getPostingMoment(signal.payload, "timeline")}`, null, null)
    ),
    trigger(
        "COMMENT_POSTED",
        (state, signal: CommentPostedAction) =>
            isAtDetailedPostingPage(state) && isCommentsReceiverPostingId(state, signal.payload.postingId),
        updateLocation
    ),
    trigger(
        "COMMENT_POSTED",
        (state, signal: CommentPostedAction) =>
            isAtDetailedPostingPage(state) && isCommentsReceiverPostingId(state, signal.payload.postingId),
        signal => commentsScrollToAnchor(signal.payload.moment)
    ),
    trigger(["COMMENT_POSTED", "COMMENT_COMPOSE_CANCEL"], true, bottomMenuShow),
    trigger(
        "COMMENT_DRAFT_SAVED",
        (state, signal: CommentDraftSavedAction) =>
            isCommentPosted(state, signal.payload.commentId, signal.payload.formId),
        signal => signal.payload.commentId == null
            ? commentDraftDelete(signal.payload.draft)
            : commentDialogCommentReset(signal.payload.draft.id, false)
    ),
    trigger(
        ["EVENT_RECEIVER_COMMENT_ADDED", "EVENT_RECEIVER_COMMENT_UPDATED"],
        (state, signal: EventAction<CommentAddedEvent> | EventAction<CommentUpdatedEvent>) =>
            getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentLoad(signal.payload.id)
    ),
    trigger(
        "EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED",
        (state, signal: EventAction<CommentReactionsChangedEvent>) =>
            isAtDetailedPostingPage(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentReactionLoad(signal.payload.id, signal.payload.postingId)
    ),
    trigger("OPEN_COMMENT_DIALOG", true, commentDialogCommentLoad),
    trigger(
        "EVENT_RECEIVER_COMMENT_UPDATED",
        (state, signal: EventAction<CommentUpdatedEvent>) =>
            isAtDetailedPostingPage(state) && isCommentDialogShown(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && getCommentDialogCommentId(state) === signal.payload.id,
        commentDialogConflict
    ),
    trigger("GLANCE_COMMENT", isGlanceCommentToBeLoaded, glanceCommentLoad)
];

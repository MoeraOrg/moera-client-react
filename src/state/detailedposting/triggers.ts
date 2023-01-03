import { conj, inv, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { OWNER_SET } from "state/node/actions";
import { isAtHomeNode } from "state/node/selectors";
import {
    bottomMenuShow,
    dialogClosed,
    dialogOpened,
    GO_TO_PAGE,
    goToTimeline,
    updateLocation,
    WAKE_UP
} from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import {
    CLOSE_COMMENT_DIALOG,
    closeCommentDialog,
    COMMENT_COMPOSE_CANCEL,
    COMMENT_DRAFT_SAVED,
    COMMENT_POSTED,
    commentDialogCommentLoad,
    commentDialogCommentReset,
    commentDialogConflict,
    commentDraftDelete,
    commentDraftLoad,
    CommentDraftSavedAction,
    commentLoad,
    CommentPostedAction,
    commentReactionLoad,
    COMMENTS_RECEIVER_SWITCHED,
    COMMENTS_SCROLL_TO_ANCHOR,
    COMMENTS_UNSET,
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsReceiverSwitch,
    commentsScrollToAnchor,
    commentsUnset,
    commentsUpdate,
    DETAILED_POSTING_LOADED,
    detailedPostingLoad,
    detailedPostingLoadAttached,
    DetailedPostingLoadedAction,
    detailedPostingViewed,
    focusComment,
    FOCUSED_COMMENT_LOAD_FAILED,
    FOCUSED_COMMENT_LOADED,
    focusedCommentLoad,
    GLANCE_COMMENT,
    glanceCommentLoad,
    OPEN_COMMENT_DIALOG
} from "state/detailedposting/actions";
import {
    getCommentDialogCommentId,
    getCommentsReceiverPostingId,
    isCommentComposeDraftToBeLoaded,
    isCommentDialogDraftToBeLoaded,
    isCommentDialogShown,
    isCommentMomentInLoadedRange,
    isCommentPosted,
    isCommentsReceiverPostingId,
    isCommentsReceiverToBeSwitched,
    isDetailedPostingDefined,
    isDetailedPostingGalleryExpanded,
    isDetailedPostingId,
    isDetailedPostingLoaded,
    isDetailedPostingToBeLoaded,
    isFocusedCommentInList,
    isFocusedCommentToBeLoaded,
    isFutureCommentsToBeLoaded,
    isGlanceCommentToBeLoaded,
    isPastCommentsToBeLoaded
} from "state/detailedposting/selectors";
import {
    POSTING_DELETED,
    POSTING_SET,
    PostingDeletedAction,
    postingSet,
    PostingSetAction
} from "state/postings/actions";
import { getPostingMoment } from "state/postings/selectors";
import {
    EVENT_RECEIVER_COMMENT_ADDED,
    EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED,
    EVENT_RECEIVER_COMMENT_UPDATED,
    EventAction
} from "api/events/actions";
import { CommentAddedEvent, CommentReactionsChangedEvent, CommentUpdatedEvent } from "api/events/api-types";

export default [
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isDetailedPostingToBeLoaded), detailedPostingLoad),
    trigger(GO_TO_PAGE, conj(isAtHomeNode, isAtDetailedPostingPage, isDetailedPostingLoaded), detailedPostingViewed),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP], isDetailedPostingDefined, detailedPostingLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, commentsUnset),
    trigger(WAKE_UP, isAtDetailedPostingPage, commentsUpdate),
    trigger(WAKE_UP, inv(isAtDetailedPostingPage), commentsUnset),
    trigger(DETAILED_POSTING_LOADED, true, (signal: DetailedPostingLoadedAction) => postingSet(signal.payload.posting)),
    trigger(
        POSTING_SET,
        (state, signal: PostingSetAction) =>
            isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.posting.id),
        updateLocation
    ),
    trigger(
        POSTING_SET,
        (state, signal: PostingSetAction) =>
            isAtHomeNode(state)
            && isAtDetailedPostingPage(state)
            && isDetailedPostingId(state, signal.payload.posting.id),
        detailedPostingViewed
    ),
    trigger(
        GO_TO_PAGE,
        conj(isAtDetailedPostingPage, isDetailedPostingGalleryExpanded),
        detailedPostingLoadAttached
    ),
    trigger(
        [GO_TO_PAGE, POSTING_SET, OWNER_SET],
        conj(isAtDetailedPostingPage, isCommentsReceiverToBeSwitched),
        commentsReceiverSwitch
    ),
    trigger(
        [GO_TO_PAGE, COMMENTS_RECEIVER_SWITCHED, CONNECTED_TO_HOME],
        conj(isAtDetailedPostingPage, isCommentComposeDraftToBeLoaded),
        commentDraftLoad(false)
    ),
    trigger(
        OPEN_COMMENT_DIALOG,
        conj(isAtDetailedPostingPage, isCommentDialogDraftToBeLoaded),
        commentDraftLoad(true)
    ),
    trigger(
        [GO_TO_PAGE, POSTING_SET, COMMENTS_RECEIVER_SWITCHED, COMMENTS_UNSET],
        conj(isAtDetailedPostingPage, isFocusedCommentToBeLoaded, isFocusedCommentInList),
        focusComment
    ),
    trigger(
        [GO_TO_PAGE, POSTING_SET, COMMENTS_RECEIVER_SWITCHED, COMMENTS_UNSET],
        conj(isAtDetailedPostingPage, isFocusedCommentToBeLoaded, inv(isFocusedCommentInList)),
        focusedCommentLoad
    ),
    trigger(
        [
            GO_TO_PAGE, COMMENTS_RECEIVER_SWITCHED, COMMENTS_UNSET, FOCUSED_COMMENT_LOADED, FOCUSED_COMMENT_LOAD_FAILED,
            COMMENTS_SCROLL_TO_ANCHOR
        ],
        conj(isAtDetailedPostingPage, isFutureCommentsToBeLoaded),
        commentsFutureSliceLoad
    ),
    trigger(
        [
            GO_TO_PAGE, COMMENTS_RECEIVER_SWITCHED, COMMENTS_UNSET, FOCUSED_COMMENT_LOADED, FOCUSED_COMMENT_LOAD_FAILED,
            COMMENTS_SCROLL_TO_ANCHOR
        ],
        conj(isAtDetailedPostingPage, isPastCommentsToBeLoaded),
        commentsPastSliceLoad
    ),
    trigger(
        POSTING_DELETED,
        (state, signal: PostingDeletedAction) =>
            isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.id),
        signal => goToTimeline(getPostingMoment(signal.payload, "timeline"))
    ),
    trigger(
        COMMENT_POSTED,
        (state, signal: CommentPostedAction) =>
            isAtDetailedPostingPage(state) && isCommentsReceiverPostingId(state, signal.payload.postingId),
        updateLocation
    ),
    trigger(
        COMMENT_POSTED,
        (state, signal: CommentPostedAction) =>
            isAtDetailedPostingPage(state) && isCommentsReceiverPostingId(state, signal.payload.postingId),
        signal => commentsScrollToAnchor(signal.payload.moment)
    ),
    trigger([COMMENT_POSTED, COMMENT_COMPOSE_CANCEL], true, bottomMenuShow),
    trigger(
        COMMENT_DRAFT_SAVED,
        (state, signal: CommentDraftSavedAction) =>
            isCommentPosted(state, signal.payload.commentId, signal.payload.formId),
        signal => signal.payload.commentId == null
            ? commentDraftDelete()
            : commentDialogCommentReset(signal.payload.draft.id, false)
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_ADDED, EVENT_RECEIVER_COMMENT_UPDATED],
        (state, signal: EventAction<CommentAddedEvent | CommentUpdatedEvent>) =>
            getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentLoad(signal.payload.id)
    ),
    trigger(
        EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED,
        (state, signal: EventAction<CommentReactionsChangedEvent>) =>
            isAtDetailedPostingPage(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentReactionLoad(signal.payload.id, signal.payload.postingId)
    ),
    trigger(OPEN_COMMENT_DIALOG, true, commentDialogCommentLoad),
    trigger(OPEN_COMMENT_DIALOG, true, dialogOpened(closeCommentDialog())),
    trigger(CLOSE_COMMENT_DIALOG, true, dialogClosed),
    trigger(
        EVENT_RECEIVER_COMMENT_UPDATED,
        (state, signal: EventAction<CommentUpdatedEvent>) =>
            isAtDetailedPostingPage(state) && isCommentDialogShown(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && getCommentDialogCommentId(state) === signal.payload.id,
        commentDialogConflict
    ),
    trigger(GLANCE_COMMENT, isGlanceCommentToBeLoaded, glanceCommentLoad)
];

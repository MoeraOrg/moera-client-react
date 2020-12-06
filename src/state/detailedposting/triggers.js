import { conj, inv, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { GO_TO_PAGE, goToTimeline, updateLocation, WAKE_UP } from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import {
    COMMENT_POSTED,
    commentDialogCommentLoad,
    commentDialogConflict,
    commentLoad,
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
    focusComment,
    FOCUSED_COMMENT_LOAD_FAILED,
    FOCUSED_COMMENT_LOADED,
    focusedCommentLoad,
    GLANCE_COMMENT,
    glanceCommentLoad,
    OPEN_COMMENT_DIALOG
} from "state/detailedposting/actions";
import {
    getCommentComposerCommentId,
    getCommentsReceiverPostingId,
    isCommentDialogShown,
    isCommentMomentInLoadedRange,
    isCommentsReceiverPostingId,
    isCommentsReceiverToBeSwitched,
    isDetailedPostingDefined,
    isDetailedPostingId,
    isDetailedPostingToBeLoaded,
    isFocusedCommentInList,
    isFocusedCommentToBeLoaded,
    isFutureCommentsToBeLoaded,
    isGlanceCommentToBeLoaded,
    isPastCommentsToBeLoaded
} from "state/detailedposting/selectors";
import { POSTING_DELETED, POSTING_SET, postingSet } from "state/postings/actions";
import { getPostingMoment } from "state/postings/selectors";
import {
    EVENT_RECEIVER_COMMENT_ADDED,
    EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED,
    EVENT_RECEIVER_COMMENT_UPDATED
} from "api/events/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isDetailedPostingToBeLoaded), detailedPostingLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP], isDetailedPostingDefined, detailedPostingLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, commentsUnset),
    trigger(WAKE_UP, isAtDetailedPostingPage, commentsUpdate),
    trigger(WAKE_UP, inv(isAtDetailedPostingPage), commentsUnset),
    trigger(DETAILED_POSTING_LOADED, true, signal => postingSet(signal.payload.posting)),
    trigger(
        POSTING_SET,
        (state, signal) => isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.posting.id),
        updateLocation
    ),
    trigger(
        [GO_TO_PAGE, POSTING_SET],
        conj(isAtDetailedPostingPage, isCommentsReceiverToBeSwitched),
        commentsReceiverSwitch
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
        (state, signal) => isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.id),
        signal => goToTimeline(getPostingMoment(signal.payload, "timeline"))
    ),
    trigger(
        COMMENT_POSTED,
        (state, signal) => isAtDetailedPostingPage(state)
            && isCommentsReceiverPostingId(state, signal.payload.postingId),
        updateLocation
    ),
    trigger(
        COMMENT_POSTED,
        (state, signal) => isAtDetailedPostingPage(state)
            && isCommentsReceiverPostingId(state, signal.payload.postingId),
        signal => commentsScrollToAnchor(signal.payload.moment)
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_ADDED, EVENT_RECEIVER_COMMENT_UPDATED],
        (state, signal) => isAtDetailedPostingPage(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentLoad(signal.payload.id)
    ),
    trigger(
        EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED,
        (state, signal) => isAtDetailedPostingPage(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentReactionLoad(signal.payload.id, signal.payload.postingId)
    ),
    trigger(OPEN_COMMENT_DIALOG, true, commentDialogCommentLoad),
    trigger(
        EVENT_RECEIVER_COMMENT_UPDATED,
        (state, signal) => isAtDetailedPostingPage(state) && isCommentDialogShown(state)
            && getCommentsReceiverPostingId(state) === signal.payload.postingId
            && getCommentComposerCommentId(state) === signal.payload.id,
        commentDialogConflict
    ),
    trigger(GLANCE_COMMENT, isGlanceCommentToBeLoaded, glanceCommentLoad)
];

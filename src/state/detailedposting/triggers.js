import { conj, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { GO_TO_PAGE, goToTimeline, updateLocation } from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import {
    commentLoad,
    COMMENTS_RECEIVER_SWITCHED,
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsReceiverSwitch,
    DETAILED_POSTING_LOADED,
    detailedPostingLoad,
    FOCUSED_COMMENT_LOAD_FAILED,
    FOCUSED_COMMENT_LOADED,
    focusedCommentLoad
} from "state/detailedposting/actions";
import {
    getCommentsReceiverPostingId,
    isCommentMomentInLoadedRange,
    isCommentsReceiverToBeSwitched,
    isDetailedPostingId,
    isDetailedPostingToBeLoaded,
    isFocusedCommentToBeLoaded,
    isFutureCommentsToBeLoaded,
    isPastCommentsToBeLoaded
} from "state/detailedposting/selectors";
import { POSTING_DELETED, POSTING_SET, postingSet } from "state/postings/actions";
import { getPostingMoment } from "state/postings/selectors";
import { EVENT_RECEIVER_COMMENT_ADDED, EVENT_RECEIVER_COMMENT_UPDATED } from "api/events/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isDetailedPostingToBeLoaded), detailedPostingLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], isAtDetailedPostingPage, detailedPostingLoad),
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
        [GO_TO_PAGE, POSTING_SET, COMMENTS_RECEIVER_SWITCHED],
        conj(isAtDetailedPostingPage, isFocusedCommentToBeLoaded),
        focusedCommentLoad
    ),
    trigger(
        [GO_TO_PAGE, COMMENTS_RECEIVER_SWITCHED, FOCUSED_COMMENT_LOADED, FOCUSED_COMMENT_LOAD_FAILED],
        conj(isAtDetailedPostingPage, isFutureCommentsToBeLoaded),
        commentsFutureSliceLoad
    ),
    trigger(
        [GO_TO_PAGE, COMMENTS_RECEIVER_SWITCHED, FOCUSED_COMMENT_LOADED, FOCUSED_COMMENT_LOAD_FAILED],
        conj(isAtDetailedPostingPage, isPastCommentsToBeLoaded),
        commentsPastSliceLoad
    ),
    trigger(
        POSTING_DELETED,
        (state, signal) => isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.id),
        signal => goToTimeline(getPostingMoment(signal.payload, "timeline"))
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_ADDED, EVENT_RECEIVER_COMMENT_UPDATED],
        (state, signal) => getCommentsReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        signal => commentLoad(signal.payload.id)
    )
];

import { conj, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { GO_TO_PAGE, goToTimeline, updateLocation } from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import {
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    DETAILED_POSTING_LOADED,
    detailedPostingLoad
} from "state/detailedposting/actions";
import {
    isDetailedPostingId,
    isDetailedPostingToBeLoaded,
    isFutureCommentsToBeLoaded,
    isPastCommentsToBeLoaded
} from "state/detailedposting/selectors";
import { POSTING_DELETED, POSTING_SET, postingSet } from "state/postings/actions";
import { getPostingMoment } from "state/postings/selectors";

export default [
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isDetailedPostingToBeLoaded), detailedPostingLoad),
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isFutureCommentsToBeLoaded), commentsFutureSliceLoad),
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isPastCommentsToBeLoaded), commentsPastSliceLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], isAtDetailedPostingPage, detailedPostingLoad),
    trigger(DETAILED_POSTING_LOADED, true, signal => postingSet(signal.payload.posting)),
    trigger(DETAILED_POSTING_LOADED, isAtDetailedPostingPage, updateLocation),
    trigger(
        POSTING_SET,
        (state, signal) => isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.posting.id),
        updateLocation
    ),
    trigger(
        POSTING_DELETED,
        (state, signal) => isAtDetailedPostingPage(state) && isDetailedPostingId(state, signal.payload.id),
        signal => goToTimeline(getPostingMoment(signal.payload, "timeline"))
    )
];

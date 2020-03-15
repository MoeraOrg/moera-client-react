import { conj, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { GO_TO_PAGE, goToTimeline, updateLocation } from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { DETAILED_POSTING_LOADED, detailedPostingLoad } from "state/detailedposting/actions";
import { isDetailedPostingId, isDetailedPostingToBeLoaded } from "state/detailedposting/selectors";
import { POSTING_DELETED, POSTING_SET, postingSet } from "state/postings/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtDetailedPostingPage, isDetailedPostingToBeLoaded), detailedPostingLoad),
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
        signal => goToTimeline(signal.payload.moment)
    )
];

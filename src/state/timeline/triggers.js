import { conj, trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation } from "state/navigation/actions";
import { isAtTimelinePage } from "state/navigation/selectors";
import { TIMELINE_SCROLLED, timelineGeneralLoad, timelineUnset } from "state/timeline/actions";
import { isTimelineContainsMoment, isTimelineGeneralToBeLoaded } from "state/timeline/selectors";
import { EVENT_NODE_POSTING_ADDED, EVENT_NODE_POSTING_RESTORED } from "api/events/actions";
import { postingLoad } from "state/postings/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtTimelinePage, isTimelineGeneralToBeLoaded), timelineGeneralLoad),
    trigger(TIMELINE_SCROLLED, true, updateLocation),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, timelineUnset),
    trigger(
        [EVENT_NODE_POSTING_ADDED, EVENT_NODE_POSTING_RESTORED],
        (state, signal) => isTimelineContainsMoment(state, signal.payload.moment), // FIXME
        signal => postingLoad(signal.payload.id)
    )
];

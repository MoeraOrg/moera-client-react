import { conj, trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation } from "state/navigation/actions";
import { isAtTimelinePage } from "state/navigation/selectors";
import {
    TIMELINE_SCROLLED,
    timelineGeneralLoad,
    timelineStoryAdded,
    timelineStoryDeleted,
    timelineUnset
} from "state/timeline/actions";
import { isTimelineContainsMoment, isTimelineGeneralToBeLoaded } from "state/timeline/selectors";
import { EVENT_NODE_STORY_ADDED, EVENT_NODE_STORY_DELETED } from "api/events/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtTimelinePage, isTimelineGeneralToBeLoaded), timelineGeneralLoad),
    trigger(TIMELINE_SCROLLED, true, updateLocation),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, timelineUnset),
    trigger(
        EVENT_NODE_STORY_ADDED,
        (state, signal) => signal.payload.feedName === "timeline"
            && isTimelineContainsMoment(state, signal.payload.moment),
        signal => timelineStoryAdded(signal.payload.postingId, signal.payload.moment)
    ),
    trigger(
        EVENT_NODE_STORY_DELETED,
        (state, signal) => signal.payload.feedName === "timeline",
        signal => timelineStoryDeleted(signal.payload.postingId, signal.payload.moment)
    )
];

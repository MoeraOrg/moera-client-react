import { trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation } from "state/navigation/actions";
import { isAtTimelinePage } from "state/navigation/selectors";
import { FEED_SCROLLED, feedGeneralLoad, feedsUnset } from "state/feeds/actions";
import { isFeedGeneralToBeLoaded } from "state/feeds/selectors";
import { EVENT_NODE_STORY_ADDED, EVENT_NODE_STORY_DELETED, EVENT_NODE_STORY_UPDATED } from "api/events/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { storyAdded, storyDeleted, storyUpdated } from "state/stories/actions";

function toStory(eventPayload) {
    const story = {...eventPayload};
    story.posting = {id: eventPayload.postingId};
    delete story.postingId;
    return story;
}

export default [
    trigger(
        GO_TO_PAGE,
        state => isAtTimelinePage(state) && isFeedGeneralToBeLoaded(state, "timeline"),
        () => feedGeneralLoad("timeline")
    ),
    trigger(FEED_SCROLLED, true, updateLocation),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, feedsUnset),
    trigger(EVENT_NODE_STORY_ADDED, true, signal => storyAdded(toStory(signal.payload))),
    trigger(EVENT_NODE_STORY_DELETED, true, signal => storyDeleted(toStory(signal.payload))),
    trigger(EVENT_NODE_STORY_UPDATED, true, signal => storyUpdated(toStory(signal.payload)))
];

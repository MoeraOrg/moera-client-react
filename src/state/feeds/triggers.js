import { inv, trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation } from "state/navigation/actions";
import { isAtTimelinePage } from "state/navigation/selectors";
import {
    FEED_SCROLLED,
    feedGeneralLoad,
    feedGeneralUnset,
    FEEDS_UNSET,
    feedStatusLoad,
    feedStatusSet,
    feedStatusUpdated,
    feedSubscribed,
    feedsUnset,
    feedUnsubscribed
} from "state/feeds/actions";
import { isFeedGeneralToBeLoaded } from "state/feeds/selectors";
import {
    EVENT_HOME_FEED_STATUS_UPDATED,
    EVENT_HOME_STORIES_STATUS_UPDATED,
    EVENT_HOME_STORY_ADDED,
    EVENT_HOME_STORY_DELETED,
    EVENT_HOME_STORY_UPDATED,
    EVENT_HOME_SUBSCRIPTION_ADDED,
    EVENT_HOME_SUBSCRIPTION_DELETED,
    EVENT_NODE_STORY_ADDED,
    EVENT_NODE_STORY_DELETED,
    EVENT_NODE_STORY_UPDATED
} from "api/events/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { storyAdded, storyDeleted, storyUpdated } from "state/stories/actions";
import { isConnectedToHome } from "state/home/selectors";
import { getOwnerName } from "state/owner/selectors";

function toStory(eventPayload, isHome) {
    const story = {...eventPayload};
    if (isHome) {
        story.feedName = ":" + story.feedName;
    }
    if (eventPayload.postingId) {
        story.posting = {id: eventPayload.postingId};
    }
    delete story.postingId;
    return story;
}

function toStatus(eventPayload) {
    const status = {...eventPayload};
    delete status.feedName;
    return status;
}

export default [
    trigger(
        GO_TO_PAGE,
        state => isAtTimelinePage(state) && isFeedGeneralToBeLoaded(state, "timeline"),
        () => feedGeneralLoad("timeline")
    ),
    trigger(FEED_SCROLLED, true, updateLocation),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        isAtTimelinePage,
        () => feedGeneralLoad("timeline")
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        inv(isAtTimelinePage),
        () => feedGeneralUnset("timeline")
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, feedsUnset),
    trigger(FEEDS_UNSET, isConnectedToHome, feedStatusLoad(":instant")),
    trigger(FEEDS_UNSET, isConnectedToHome, feedStatusLoad(":news")),
    trigger(EVENT_NODE_STORY_ADDED, true, signal => storyAdded(toStory(signal.payload, false))),
    trigger(EVENT_NODE_STORY_DELETED, true, signal => storyDeleted(toStory(signal.payload, false))),
    trigger(EVENT_NODE_STORY_UPDATED, true, signal => storyUpdated(toStory(signal.payload, false))),
    trigger(EVENT_HOME_STORY_ADDED, true, signal => storyAdded(toStory(signal.payload, true))),
    trigger(EVENT_HOME_STORY_DELETED, true, signal => storyDeleted(toStory(signal.payload, true))),
    trigger(EVENT_HOME_STORY_UPDATED, true, signal => storyUpdated(toStory(signal.payload, true))),
    trigger(
        EVENT_HOME_FEED_STATUS_UPDATED,
        true,
        signal => feedStatusSet(":" + signal.payload.feedName, toStatus(signal.payload))
    ),
    trigger(
        EVENT_HOME_STORIES_STATUS_UPDATED,
        true,
        signal => feedStatusUpdated(
            ":" + signal.payload.feedName, signal.payload.viewed, signal.payload.read, signal.payload.before)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal) => getOwnerName(state) === signal.payload.remoteNodeName,
        signal => feedSubscribed("", signal.payload.remoteFeedName, signal.payload.remoteSubscriberId)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal) => getOwnerName(state) === signal.payload.remoteNodeName,
        signal => feedUnsubscribed("", signal.payload.remoteFeedName)
    )
];

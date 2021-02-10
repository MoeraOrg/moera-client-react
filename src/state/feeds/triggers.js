import { disj, inv, trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation, WAKE_UP } from "state/navigation/actions";
import { isAtProfilePage, isAtTimelinePage } from "state/navigation/selectors";
import {
    FEED_SCROLLED,
    feedGeneralLoad,
    feedGeneralUnset,
    feedPastSliceLoad,
    FEEDS_UNSET,
    feedStatusLoad,
    feedStatusSet,
    feedStatusUpdated,
    feedSubscribed,
    feedsUnset,
    feedsUpdate,
    feedUnsubscribed
} from "state/feeds/actions";
import { isFeedGeneralToBeLoaded, isFeedToBeLoaded } from "state/feeds/selectors";
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
import { postingSubscriptionSet, remotePostingSubscriptionSet } from "state/postings/actions";
import { POST_INIT, POST_INIT_DELAYED } from "state/pulse/actions";

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
        state => (isAtTimelinePage(state) || isAtProfilePage(state))
            && isFeedGeneralToBeLoaded(state, "timeline"),
        feedGeneralLoad("timeline")
    ),
    trigger(FEED_SCROLLED, true, updateLocation),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        disj(isAtTimelinePage, isAtProfilePage),
        feedGeneralLoad("timeline")
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        inv(disj(isAtTimelinePage, isAtProfilePage)),
        feedGeneralUnset("timeline")
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, feedsUnset),
    trigger(WAKE_UP, true, feedsUpdate),
    trigger(FEEDS_UNSET, isConnectedToHome, feedStatusLoad(":instant")),
    trigger(FEEDS_UNSET, isConnectedToHome, feedStatusLoad(":news")),
    trigger(
        [POST_INIT, POST_INIT_DELAYED],
        state => isConnectedToHome(state) && isFeedToBeLoaded(state, ":instant"),
        feedPastSliceLoad(":instant")
    ),
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
        signal => feedSubscribed(signal.payload.remoteNodeName, true, signal.payload.remoteFeedName,
            signal.payload.remoteSubscriberId)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal) => getOwnerName(state) === signal.payload.remoteNodeName,
        signal => feedUnsubscribed(signal.payload.remoteNodeName, true, signal.payload.remoteFeedName)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal) => signal.payload.remotePostingId != null
            && getOwnerName(state) === signal.payload.remoteNodeName,
        signal => postingSubscriptionSet(signal.payload.remotePostingId, signal.payload.subscriptionType,
            signal.payload.remoteSubscriberId)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal) => signal.payload.remotePostingId != null
            && getOwnerName(state) !== signal.payload.remoteNodeName,
        signal => remotePostingSubscriptionSet(signal.payload.remoteNodeName, signal.payload.remotePostingId,
            signal.payload.subscriptionType, signal.payload.remoteSubscriberId)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal) => signal.payload.remotePostingId != null
            && getOwnerName(state) === signal.payload.remoteNodeName,
        signal => postingSubscriptionSet(signal.payload.remotePostingId, signal.payload.subscriptionType,
            null)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal) => signal.payload.remotePostingId != null
            && getOwnerName(state) !== signal.payload.remoteNodeName,
        signal => remotePostingSubscriptionSet(signal.payload.remoteNodeName, signal.payload.remotePostingId,
            signal.payload.subscriptionType, null)
    )
];

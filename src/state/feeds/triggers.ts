import { disj, inv, trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation, WAKE_UP } from "state/navigation/actions";
import { isAtNewsPage, isAtProfilePage, isAtTimelinePage } from "state/navigation/selectors";
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
import {
    isFeedGeneralToBeLoaded,
    isFeedStatusToBeLoaded,
    isFeedToBeLoaded,
    subscriptionToSubscriber
} from "state/feeds/selectors";
import {
    EVENT_HOME_FEED_STATUS_UPDATED,
    EVENT_HOME_STORIES_STATUS_UPDATED,
    EVENT_HOME_STORY_ADDED,
    EVENT_HOME_STORY_DELETED,
    EVENT_HOME_STORY_UPDATED,
    EVENT_HOME_SUBSCRIPTION_ADDED,
    EVENT_HOME_SUBSCRIPTION_DELETED,
    EVENT_NODE_FEED_STATUS_UPDATED,
    EVENT_NODE_STORIES_STATUS_UPDATED,
    EVENT_NODE_STORY_ADDED,
    EVENT_NODE_STORY_DELETED,
    EVENT_NODE_STORY_UPDATED,
    EventAction
} from "api/events/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { storyAdded, storyDeleted, storyUpdated } from "state/stories/actions";
import { isConnectedToHome } from "state/home/selectors";
import { getOwnerName } from "state/owner/selectors";
import { postingSubscriptionSet, remotePostingSubscriptionSet } from "state/postings/actions";
import { POST_INIT, POST_INIT_DELAYED } from "state/pulse/actions";
import {
    FeedStatusUpdatedEvent,
    StoriesStatusUpdatedEvent,
    StoryAddedEvent,
    StoryDeletedEvent,
    StoryEvent,
    StoryUpdatedEvent,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent
} from "api/events/api-types";
import { WithContext } from "state/action-types";
import { StoryInfo } from "api/node/api-types";
import { now } from "util/misc";

function toStory(eventPayload: Omit<StoryEvent<any>, "type">, isHome: boolean): StoryInfo {
    const story: StoryInfo & {postingId?: string} = {
        ...eventPayload,
        createdAt: now()
    };
    if (isHome) {
        story.feedName = ":" + story.feedName;
    }
    if (eventPayload.postingId) {
        story.posting = {
            id: eventPayload.postingId,
        };
    }
    delete story.postingId;
    return story;
}

export default [
    trigger(
        GO_TO_PAGE,
        state => (isAtTimelinePage(state) || isAtProfilePage(state))
            && isFeedGeneralToBeLoaded(state, "timeline"),
        feedGeneralLoad("timeline")
    ),
    trigger(
        GO_TO_PAGE,
        state => isAtTimelinePage(state) && isFeedStatusToBeLoaded(state, "timeline"),
        feedStatusLoad("timeline")
    ),
    trigger(
        GO_TO_PAGE,
        state => isAtNewsPage(state) && isFeedStatusToBeLoaded(state, "news"),
        feedStatusLoad("news")
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
    trigger(
        EVENT_NODE_STORY_ADDED,
        true,
        (signal: EventAction<StoryAddedEvent>) => storyAdded(toStory(signal.payload, false))
    ),
    trigger(
        EVENT_NODE_STORY_DELETED,
        true,
        (signal: EventAction<StoryDeletedEvent>) => storyDeleted(toStory(signal.payload, false))
    ),
    trigger(
        EVENT_NODE_STORY_UPDATED,
        true,
        (signal: EventAction<StoryUpdatedEvent>) => storyUpdated(toStory(signal.payload, false))
    ),
    trigger(
        EVENT_HOME_STORY_ADDED,
        true,
        (signal: EventAction<StoryAddedEvent>) => storyAdded(toStory(signal.payload, true))
    ),
    trigger(
        EVENT_HOME_STORY_DELETED,
        true,
        (signal: EventAction<StoryDeletedEvent>) => storyDeleted(toStory(signal.payload, true))
    ),
    trigger(
        EVENT_HOME_STORY_UPDATED,
        true,
        (signal: EventAction<StoryUpdatedEvent>) => storyUpdated(toStory(signal.payload, true))
    ),
    trigger(
        EVENT_NODE_FEED_STATUS_UPDATED,
        true,
        (signal: EventAction<FeedStatusUpdatedEvent>) =>
            feedStatusSet(signal.payload.feedName, signal.payload.status)
    ),
    trigger(
        EVENT_HOME_FEED_STATUS_UPDATED,
        true,
        (signal: EventAction<FeedStatusUpdatedEvent>) =>
            feedStatusSet(":" + signal.payload.feedName, signal.payload.status)
    ),
    trigger(
        EVENT_NODE_STORIES_STATUS_UPDATED,
        true,
        (signal: EventAction<StoriesStatusUpdatedEvent>) => feedStatusUpdated(
            signal.payload.feedName, signal.payload.viewed ?? null, signal.payload.read ?? null,
            signal.payload.before)
    ),
    trigger(
        EVENT_HOME_STORIES_STATUS_UPDATED,
        true,
        (signal: EventAction<StoriesStatusUpdatedEvent>) => feedStatusUpdated(
            ":" + signal.payload.feedName, signal.payload.viewed ?? null, signal.payload.read ?? null,
            signal.payload.before)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal: WithContext<EventAction<SubscriptionAddedEvent>>) =>
            getOwnerName(state) === signal.payload.remoteNodeName && signal.payload.remoteFeedName != null,
        signal => feedSubscribed(signal.payload.remoteNodeName, signal.payload.remoteFullName ?? null,
            signal.payload.remoteAvatar ?? null, signal.payload.remoteFeedName!,
            subscriptionToSubscriber({...signal.payload, type: signal.payload.subscriptionType},
                signal.context.homeOwnerName!, signal.context.homeOwnerFullName, signal.context.homeOwnerAvatar))
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            getOwnerName(state) === signal.payload.remoteNodeName && signal.payload.remoteFeedName != null,
        signal => feedUnsubscribed(signal.payload.remoteNodeName, signal.payload.remoteFeedName!)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal: EventAction<SubscriptionAddedEvent>) =>
            signal.payload.remotePostingId != null && getOwnerName(state) === signal.payload.remoteNodeName,
        signal => postingSubscriptionSet(signal.payload.remotePostingId!, signal.payload.subscriptionType,
            signal.payload.remoteSubscriberId)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal: EventAction<SubscriptionAddedEvent>) =>
            signal.payload.remotePostingId != null && getOwnerName(state) !== signal.payload.remoteNodeName,
        signal => remotePostingSubscriptionSet(signal.payload.remoteNodeName, signal.payload.remotePostingId!,
            signal.payload.subscriptionType, signal.payload.remoteSubscriberId)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.remotePostingId != null && getOwnerName(state) === signal.payload.remoteNodeName,
        signal => postingSubscriptionSet(signal.payload.remotePostingId!, signal.payload.subscriptionType,
            null)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.remotePostingId != null && getOwnerName(state) !== signal.payload.remoteNodeName,
        signal => remotePostingSubscriptionSet(signal.payload.remoteNodeName, signal.payload.remotePostingId!,
            signal.payload.subscriptionType, null)
    )
];

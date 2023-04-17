import { disj, inv, trigger } from "state/trigger";
import { GO_TO_PAGE, updateLocation, WAKE_UP } from "state/navigation/actions";
import { isAtDetailedPostingPage, isAtNewsPage, isAtProfilePage, isAtTimelinePage } from "state/navigation/selectors";
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
    feedSubscriberUpdated,
    feedSubscriptionUpdated,
    feedsUnset,
    feedsUpdate,
    feedUnsubscribed
} from "state/feeds/actions";
import { isFeedGeneralToBeLoaded, isFeedStatusToBeLoaded, isFeedToBeLoaded } from "state/feeds/selectors";
import {
    EVENT_HOME_FEED_STATUS_UPDATED,
    EVENT_HOME_STORIES_STATUS_UPDATED,
    EVENT_HOME_STORY_ADDED,
    EVENT_HOME_STORY_DELETED,
    EVENT_HOME_STORY_UPDATED,
    EVENT_HOME_SUBSCRIBER_UPDATED,
    EVENT_HOME_SUBSCRIPTION_ADDED,
    EVENT_HOME_SUBSCRIPTION_DELETED,
    EVENT_HOME_SUBSCRIPTION_UPDATED,
    EVENT_NODE_FEED_STATUS_UPDATED,
    EVENT_NODE_STORIES_STATUS_UPDATED,
    EVENT_NODE_STORY_ADDED,
    EVENT_NODE_STORY_DELETED,
    EVENT_NODE_STORY_UPDATED,
    EVENT_NODE_SUBSCRIBER_UPDATED,
    EVENT_NODE_SUBSCRIPTION_UPDATED,
    EventAction
} from "api/events/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET } from "state/home/actions";
import { isConnectedToHome } from "state/home/selectors";
import { OWNER_SET } from "state/node/actions";
import { getOwnerName } from "state/node/selectors";
import { storyAdded, storyDeleted, storyUpdated } from "state/stories/actions";
import { postingSubscriptionSet, remotePostingSubscriptionSet } from "state/postings/actions";
import { POST_INIT, POST_INIT_DELAYED } from "state/pulse/actions";
import {
    FeedStatusUpdatedEvent,
    StoriesStatusUpdatedEvent,
    StoryAddedEvent,
    StoryDeletedEvent,
    StoryEvent,
    StoryUpdatedEvent,
    SubscriberUpdatedEvent,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent,
    SubscriptionUpdatedEvent
} from "api/events/api-types";
import { WithContext } from "state/action-types";
import { StoryInfo } from "api/node/api-types";
import { now } from "util/misc";

function toStory(eventPayload: Omit<StoryEvent<any> | StoryDeletedEvent, "type">, isHome: boolean): StoryInfo {
    const story: StoryInfo & {postingId?: string | null} = {
        publishedAt: 0,
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
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, OWNER_SET, HOME_OWNER_SET],
        disj(isAtTimelinePage, isAtProfilePage, isAtDetailedPostingPage),
        feedGeneralLoad("timeline")
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, OWNER_SET, HOME_OWNER_SET],
        inv(disj(isAtTimelinePage, isAtProfilePage, isAtDetailedPostingPage)),
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
            signal.payload.subscription.type === "feed"
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName
            && signal.payload.subscription.remoteFeedName != null,
        signal => feedSubscribed(signal.payload.subscription.remoteNodeName, signal.payload.subscription)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.subscription.type === "feed"
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName
            && signal.payload.subscription.remoteFeedName != null,
        signal => feedUnsubscribed(signal.payload.subscription.remoteNodeName,
            signal.payload.subscription.remoteFeedName!, signal.payload.subscription.contact ?? null)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal: EventAction<SubscriptionAddedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName,
        signal => postingSubscriptionSet(signal.payload.subscription.remotePostingId!, signal.payload.subscription.type,
            signal.payload.subscription.id)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_ADDED,
        (state, signal: EventAction<SubscriptionAddedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) !== signal.payload.subscription.remoteNodeName,
        signal => remotePostingSubscriptionSet(signal.payload.subscription.remoteNodeName,
            signal.payload.subscription.remotePostingId!, signal.payload.subscription.type,
            signal.payload.subscription.id)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName,
        signal => postingSubscriptionSet(signal.payload.subscription.remotePostingId!, signal.payload.subscription.type,
            null)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_DELETED,
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) !== signal.payload.subscription.remoteNodeName,
        signal => remotePostingSubscriptionSet(signal.payload.subscription.remoteNodeName,
            signal.payload.subscription.remotePostingId!, signal.payload.subscription.type, null)
    ),
    trigger(
        EVENT_HOME_SUBSCRIBER_UPDATED,
        (state, signal: EventAction<SubscriberUpdatedEvent>) => signal.payload.subscriber.type === "feed",
        signal => feedSubscriberUpdated(signal.context.homeOwnerName!, signal.payload.subscriber)
    ),
    trigger(
        EVENT_NODE_SUBSCRIBER_UPDATED,
        (state, signal: EventAction<SubscriberUpdatedEvent>) => signal.payload.subscriber.type === "feed",
        signal => feedSubscriberUpdated(signal.context.ownerName!, signal.payload.subscriber)
    ),
    trigger(
        EVENT_HOME_SUBSCRIPTION_UPDATED,
        (state, signal: EventAction<SubscriptionUpdatedEvent>) => signal.payload.subscription.type === "feed",
        signal => feedSubscriptionUpdated(signal.context.homeOwnerName!, signal.payload.subscription)
    ),
    trigger(
        EVENT_NODE_SUBSCRIPTION_UPDATED,
        (state, signal: EventAction<SubscriptionUpdatedEvent>) => signal.payload.subscription.type === "feed",
        signal => feedSubscriptionUpdated(signal.context.ownerName!, signal.payload.subscription)
    )
];

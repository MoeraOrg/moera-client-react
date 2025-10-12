import { disj, trigger } from "state/trigger";
import { updateLocation } from "state/navigation/actions";
import {
    isAtDetailedPostingPage,
    isAtExplorePage,
    isAtNewsPage,
    isAtTimelinePage,
    isInProfilePages
} from "state/navigation/selectors";
import {
    feedFutureSliceLoad,
    feedGeneralLoad,
    feedPastSliceLoad,
    feedStatusLoad,
    feedStatusSet,
    feedStatusUpdated,
    feedSubscribed,
    feedSubscriberUpdated,
    feedSubscriptionUpdated,
    feedsUpdate,
    feedUnsubscribed
} from "state/feeds/actions";
import {
    isFeedFutureToBeLoaded,
    isFeedGeneralToBeLoaded,
    isFeedPastToBeLoaded,
    isFeedStatusToBeLoaded,
    isFeedToBeLoaded
} from "state/feeds/selectors";
import { StoryInfo } from "api";
import {
    EventAction,
    FeedStatusUpdatedEvent,
    StoriesStatusUpdatedEvent,
    StoryAddedEvent,
    StoryDeletedEvent,
    StoryUpdatedEvent,
    SubscriberUpdatedEvent,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent,
    SubscriptionUpdatedEvent
} from "api/events";
import { isConnectedToHome } from "state/home/selectors";
import { getOwnerName } from "state/node/selectors";
import { storyAdded, storyDeleted, storyUpdated } from "state/stories/actions";
import { postingSubscriptionSet, remotePostingSubscriptionSet } from "state/postings/actions";
import { WithContext } from "state/action-types";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { now } from "util/misc";

const toStory = (eventPayload: Omit<StoryAddedEvent | StoryUpdatedEvent | StoryDeletedEvent, "type">): StoryInfo => ({
    publishedAt: 0,
    ...eventPayload,
    createdAt: now()
});

export default [
    trigger(
        "GO_TO_PAGE",
        state => (isInProfilePages(state) || isAtDetailedPostingPage(state))
            && isFeedGeneralToBeLoaded(state, REL_CURRENT, "timeline"),
        feedGeneralLoad(REL_CURRENT, "timeline")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtTimelinePage(state) && isFeedStatusToBeLoaded(state, REL_CURRENT, "timeline"),
        feedStatusLoad(REL_CURRENT, "timeline")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtNewsPage(state) && isFeedStatusToBeLoaded(state, REL_CURRENT, "news"),
        feedStatusLoad(REL_CURRENT, "news")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtExplorePage(state) && isFeedStatusToBeLoaded(state, REL_CURRENT, "explore"),
        feedStatusLoad(REL_CURRENT, "explore")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtTimelinePage(state) && isFeedFutureToBeLoaded(state, REL_CURRENT, "timeline"),
        feedFutureSliceLoad(REL_CURRENT, "timeline")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtTimelinePage(state) && isFeedPastToBeLoaded(state, REL_CURRENT, "timeline"),
        feedPastSliceLoad(REL_CURRENT, "timeline")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtNewsPage(state) && isFeedFutureToBeLoaded(state, REL_CURRENT, "news"),
        feedFutureSliceLoad(REL_CURRENT, "news")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtNewsPage(state) && isFeedPastToBeLoaded(state, REL_CURRENT, "news"),
        feedPastSliceLoad(REL_CURRENT, "news")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtExplorePage(state) && isFeedFutureToBeLoaded(state, REL_CURRENT, "explore"),
        feedFutureSliceLoad(REL_CURRENT, "explore")
    ),
    trigger(
        ["GO_TO_PAGE", "HOME_READY"],
        state => isAtExplorePage(state) && isFeedPastToBeLoaded(state, REL_CURRENT, "explore"),
        feedPastSliceLoad(REL_CURRENT, "explore")
    ),
    trigger("FEED_SCROLLED", true, updateLocation),
    trigger(
        "HOME_READY",
        disj(isInProfilePages, isAtDetailedPostingPage),
        feedGeneralLoad(REL_CURRENT, "timeline")
    ),
    trigger("WAKE_UP", true, feedsUpdate),
    trigger("HOME_READY", isConnectedToHome, feedStatusLoad(REL_HOME, "instant")),
    trigger("HOME_READY", isConnectedToHome, feedStatusLoad(REL_HOME, "news")),
    trigger("HOME_READY", isConnectedToHome, feedStatusLoad(REL_HOME, "explore")),
    trigger(
        ["POST_INIT", "POST_INIT_DELAYED"],
        state => isConnectedToHome(state) && isFeedToBeLoaded(state, REL_HOME, "instant"),
        feedPastSliceLoad(REL_HOME, "instant")
    ),
    trigger(
        "EVENT_NODE_STORY_ADDED",
        true,
        (signal: EventAction<StoryAddedEvent>) => storyAdded(REL_CURRENT, toStory(signal.payload))
    ),
    trigger(
        "EVENT_NODE_STORY_DELETED",
        true,
        (signal: EventAction<StoryDeletedEvent>) => storyDeleted(REL_CURRENT, toStory(signal.payload))
    ),
    trigger(
        "EVENT_NODE_STORY_UPDATED",
        true,
        (signal: EventAction<StoryUpdatedEvent>) => storyUpdated(REL_CURRENT, toStory(signal.payload))
    ),
    trigger(
        "EVENT_HOME_STORY_ADDED",
        true,
        (signal: EventAction<StoryAddedEvent>) => storyAdded(REL_HOME, toStory(signal.payload))
    ),
    trigger(
        "EVENT_HOME_STORY_DELETED",
        true,
        (signal: EventAction<StoryDeletedEvent>) => storyDeleted(REL_HOME, toStory(signal.payload))
    ),
    trigger(
        "EVENT_HOME_STORY_UPDATED",
        true,
        (signal: EventAction<StoryUpdatedEvent>) => storyUpdated(REL_HOME, toStory(signal.payload))
    ),
    trigger(
        "EVENT_NODE_FEED_STATUS_UPDATED",
        true,
        (signal: EventAction<FeedStatusUpdatedEvent>) =>
            feedStatusSet(REL_CURRENT, signal.payload.feedName, signal.payload.status)
    ),
    trigger(
        "EVENT_HOME_FEED_STATUS_UPDATED",
        true,
        (signal: EventAction<FeedStatusUpdatedEvent>) =>
            feedStatusSet(REL_HOME, signal.payload.feedName, signal.payload.status)
    ),
    trigger(
        "EVENT_NODE_STORIES_STATUS_UPDATED",
        true,
        (signal: EventAction<StoriesStatusUpdatedEvent>) => feedStatusUpdated(
            REL_CURRENT, signal.payload.feedName, signal.payload.viewed ?? null, signal.payload.read ?? null,
            signal.payload.before)
    ),
    trigger(
        "EVENT_HOME_STORIES_STATUS_UPDATED",
        true,
        (signal: EventAction<StoriesStatusUpdatedEvent>) => feedStatusUpdated(
            REL_HOME, signal.payload.feedName, signal.payload.viewed ?? null, signal.payload.read ?? null,
            signal.payload.before)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_ADDED",
        (state, signal: WithContext<EventAction<SubscriptionAddedEvent>>) =>
            signal.payload.subscription.type === "feed"
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName
            && signal.payload.subscription.remoteFeedName != null,
        (signal: EventAction<SubscriptionAddedEvent>) =>
            feedSubscribed(signal.payload.subscription.remoteNodeName, signal.payload.subscription)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_DELETED",
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.subscription.type === "feed"
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName
            && signal.payload.subscription.remoteFeedName != null,
        (signal: EventAction<SubscriptionDeletedEvent>) => feedUnsubscribed(signal.payload.subscription.remoteNodeName,
            signal.payload.subscription.remoteFeedName!, signal.payload.subscription.contact ?? null)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_ADDED",
        (state, signal: EventAction<SubscriptionAddedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName,
        (signal: EventAction<SubscriptionAddedEvent>) => postingSubscriptionSet(
            signal.payload.subscription.remotePostingId!, signal.payload.subscription.type,
            signal.payload.subscription.id, REL_CURRENT)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_ADDED",
        (state, signal: EventAction<SubscriptionAddedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) !== signal.payload.subscription.remoteNodeName,
        (signal: EventAction<SubscriptionAddedEvent>) => remotePostingSubscriptionSet(
            signal.payload.subscription.remoteNodeName, signal.payload.subscription.remotePostingId!,
            signal.payload.subscription.type, signal.payload.subscription.id, REL_CURRENT)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_DELETED",
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) === signal.payload.subscription.remoteNodeName,
        (signal: EventAction<SubscriptionDeletedEvent>) => postingSubscriptionSet(
            signal.payload.subscription.remotePostingId!, signal.payload.subscription.type, null, REL_CURRENT)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_DELETED",
        (state, signal: EventAction<SubscriptionDeletedEvent>) =>
            signal.payload.subscription.type === "posting-comments"
            && signal.payload.subscription.remotePostingId != null
            && getOwnerName(state) !== signal.payload.subscription.remoteNodeName,
        (signal: EventAction<SubscriptionDeletedEvent>) => remotePostingSubscriptionSet(
            signal.payload.subscription.remoteNodeName, signal.payload.subscription.remotePostingId!,
            signal.payload.subscription.type, null, REL_CURRENT)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIBER_UPDATED",
        (_, signal: EventAction<SubscriberUpdatedEvent>) => signal.payload.subscriber.type === "feed",
        (signal: WithContext<EventAction<SubscriberUpdatedEvent>>) =>
            feedSubscriberUpdated(signal.context.homeOwnerName!, signal.payload.subscriber)
    ),
    trigger(
        "EVENT_NODE_SUBSCRIBER_UPDATED",
        (_, signal: EventAction<SubscriberUpdatedEvent>) => signal.payload.subscriber.type === "feed",
        (signal: WithContext<EventAction<SubscriberUpdatedEvent>>) =>
            feedSubscriberUpdated(signal.context.ownerName!, signal.payload.subscriber)
    ),
    trigger(
        "EVENT_HOME_SUBSCRIPTION_UPDATED",
        (_, signal: EventAction<SubscriptionUpdatedEvent>) => signal.payload.subscription.type === "feed",
        (signal: WithContext<EventAction<SubscriptionUpdatedEvent>>) =>
            feedSubscriptionUpdated(signal.context.homeOwnerName!, signal.payload.subscription)
    ),
    trigger(
        "EVENT_NODE_SUBSCRIPTION_UPDATED",
        (_, signal: EventAction<SubscriptionUpdatedEvent>) => signal.payload.subscription.type === "feed",
        (signal: WithContext<EventAction<SubscriptionUpdatedEvent>>) =>
            feedSubscriptionUpdated(signal.context.ownerName!, signal.payload.subscription)
    )
];

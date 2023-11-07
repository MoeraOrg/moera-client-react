import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { ContactInfo, FeedInfo, FeedStatus, StoryInfo, SubscriberInfo, SubscriptionInfo } from "api";

export type FeedGeneralLoadAction = ActionWithPayload<"FEED_GENERAL_LOAD", {
    feedName: string;
}>;
export const feedGeneralLoad = (feedName: string): FeedGeneralLoadAction =>
    actionWithPayload("FEED_GENERAL_LOAD", {feedName});

export type FeedGeneralLoadFailedAction = ActionWithPayload<"FEED_GENERAL_LOAD_FAILED", {
    feedName: string;
}>;
export const feedGeneralLoadFailed = (feedName: string): FeedGeneralLoadFailedAction =>
    actionWithPayload("FEED_GENERAL_LOAD_FAILED", {feedName});

export type FeedGeneralSetAction = ActionWithPayload<"FEED_GENERAL_SET", {
    feedName: string;
    info: FeedInfo;
}>;
export const feedGeneralSet = (feedName: string, info: FeedInfo): FeedGeneralSetAction =>
    actionWithPayload("FEED_GENERAL_SET", {feedName, info});

export type FeedGeneralUnsetAction = ActionWithPayload<"FEED_GENERAL_UNSET", {
    feedName: string;
}>;
export const feedGeneralUnset = (feedName: string): FeedGeneralUnsetAction =>
    actionWithPayload("FEED_GENERAL_UNSET", {feedName});

export type FeedSubscribeAction = ActionWithPayload<"FEED_SUBSCRIBE", {
    nodeName: string;
    feedName: string;
    storyId?: string | null;
}>;
export const feedSubscribe = (nodeName: string, feedName: string, storyId?: string | null): FeedSubscribeAction =>
    actionWithPayload("FEED_SUBSCRIBE", {nodeName, feedName, storyId});

export type FeedSubscribedAction = ActionWithPayload<"FEED_SUBSCRIBED", {
    nodeName: string;
    subscription: SubscriptionInfo;
}>;
export const feedSubscribed = (nodeName: string, subscription: SubscriptionInfo): FeedSubscribedAction =>
    actionWithPayload("FEED_SUBSCRIBED", {nodeName, subscription});

export type FeedSubscribeFailedAction = ActionWithPayload<"FEED_SUBSCRIBE_FAILED", {
    nodeName: string;
    feedName: string;
}>;
export const feedSubscribeFailed = (nodeName: string, feedName: string): FeedSubscribeFailedAction =>
    actionWithPayload("FEED_SUBSCRIBE_FAILED", {nodeName, feedName});

export type FeedUnsubscribeAction = ActionWithPayload<"FEED_UNSUBSCRIBE", {
    nodeName: string;
    feedName: string;
    subscriptionId: string;
}>;
export const feedUnsubscribe = (nodeName: string, feedName: string, subscriptionId: string): FeedUnsubscribeAction =>
    actionWithPayload("FEED_UNSUBSCRIBE", {nodeName, feedName, subscriptionId});

export type FeedUnsubscribedAction = ActionWithPayload<"FEED_UNSUBSCRIBED", {
    nodeName: string;
    feedName: string;
    contact: ContactInfo | null;
}>;
export const feedUnsubscribed = (
    nodeName: string, feedName: string, contact: ContactInfo | null
): FeedUnsubscribedAction =>
    actionWithPayload("FEED_UNSUBSCRIBED", {nodeName, feedName, contact});

export type FeedUnsubscribeFailedAction = ActionWithPayload<"FEED_UNSUBSCRIBE_FAILED", {
    nodeName: string;
    feedName: string;
}>;
export const feedUnsubscribeFailed = (nodeName: string, feedName: string): FeedUnsubscribeFailedAction =>
    actionWithPayload("FEED_UNSUBSCRIBE_FAILED", {nodeName, feedName});

export type FeedSubscriberSetVisibilityAction = ActionWithPayload<"FEED_SUBSCRIBER_SET_VISIBILITY", {
    subscriberId: string;
    feedName: string;
    visible: boolean;
}>;
export const feedSubscriberSetVisibility = (
    subscriberId: string, feedName: string, visible: boolean
): FeedSubscriberSetVisibilityAction =>
    actionWithPayload("FEED_SUBSCRIBER_SET_VISIBILITY", {subscriberId, feedName, visible});

export type FeedSubscriptionSetVisibilityAction = ActionWithPayload<"FEED_SUBSCRIPTION_SET_VISIBILITY", {
    subscriptionId: string;
    visible: boolean;
}>;
export const feedSubscriptionSetVisibility = (
    subscriptionId: string, visible: boolean
): FeedSubscriptionSetVisibilityAction =>
    actionWithPayload("FEED_SUBSCRIPTION_SET_VISIBILITY", {subscriptionId, visible});

export type FeedSubscriberUpdatedAction = ActionWithPayload<"FEED_SUBSCRIBER_UPDATED", {
    nodeName: string;
    subscriber: SubscriberInfo;
}>;
export const feedSubscriberUpdated = (nodeName: string, subscriber: SubscriberInfo): FeedSubscriberUpdatedAction =>
    actionWithPayload("FEED_SUBSCRIBER_UPDATED", {nodeName, subscriber});

export type FeedSubscriptionUpdatedAction = ActionWithPayload<"FEED_SUBSCRIPTION_UPDATED", {
    nodeName: string;
    subscription: SubscriptionInfo;
}>;
export const feedSubscriptionUpdated = (
    nodeName: string, subscription: SubscriptionInfo
): FeedSubscriptionUpdatedAction =>
    actionWithPayload("FEED_SUBSCRIPTION_UPDATED", {nodeName, subscription});

export type FeedStatusLoadAction = ActionWithPayload<"FEED_STATUS_LOAD", {
    feedName: string;
}>;
export const feedStatusLoad = (feedName: string): FeedStatusLoadAction =>
    actionWithPayload("FEED_STATUS_LOAD", {feedName});

export type FeedStatusLoadFailedAction = ActionWithPayload<"FEED_STATUS_LOAD_FAILED", {
    feedName: string;
}>;
export const feedStatusLoadFailed = (feedName: string): FeedStatusLoadFailedAction =>
    actionWithPayload("FEED_STATUS_LOAD_FAILED", {feedName});

export type FeedStatusSetAction = ActionWithPayload<"FEED_STATUS_SET", {
    feedName: string;
    status: FeedStatus;
}>;
export const feedStatusSet = (feedName: string, status: FeedStatus): FeedStatusSetAction =>
    actionWithPayload("FEED_STATUS_SET", {feedName, status});

export type FeedStatusUpdateAction = ActionWithPayload<"FEED_STATUS_UPDATE", {
    feedName: string;
    viewed: boolean | null;
    read: boolean | null;
    before: number;
}>;
export const feedStatusUpdate = (
    feedName: string, viewed: boolean | null, read: boolean | null, before: number
): FeedStatusUpdateAction =>
    actionWithPayload("FEED_STATUS_UPDATE", {feedName, viewed, read, before});

export type FeedStatusUpdateFailedAction = ActionWithPayload<"FEED_STATUS_UPDATE_FAILED", {
    feedName: string;
}>;
export const feedStatusUpdateFailed = (feedName: string): FeedStatusUpdateFailedAction =>
    actionWithPayload("FEED_STATUS_UPDATE_FAILED", {feedName});

export type FeedStatusUpdatedAction = ActionWithPayload<"FEED_STATUS_UPDATED", {
    feedName: string;
    viewed: boolean | null;
    read: boolean | null;
    before: number;
}>;
export const feedStatusUpdated = (
    feedName: string, viewed: boolean | null, read: boolean | null, before: number
): FeedStatusUpdatedAction =>
    actionWithPayload("FEED_STATUS_UPDATED", {feedName, viewed, read, before});

export type FeedPastSliceLoadAction = ActionWithPayload<"FEED_PAST_SLICE_LOAD", {
    feedName: string;
}>;
export const feedPastSliceLoad = (feedName: string): FeedPastSliceLoadAction =>
    actionWithPayload("FEED_PAST_SLICE_LOAD", {feedName});

export type FeedPastSliceLoadFailedAction = ActionWithPayload<"FEED_PAST_SLICE_LOAD_FAILED", {
    feedName: string;
}>;
export const feedPastSliceLoadFailed = (feedName: string): FeedPastSliceLoadFailedAction =>
    actionWithPayload("FEED_PAST_SLICE_LOAD_FAILED", {feedName});

export type FeedFutureSliceLoadAction = ActionWithPayload<"FEED_FUTURE_SLICE_LOAD", {
    feedName: string;
}>;
export const feedFutureSliceLoad = (feedName: string): FeedFutureSliceLoadAction =>
    actionWithPayload("FEED_FUTURE_SLICE_LOAD", {feedName});

export type FeedFutureSliceLoadFailedAction = ActionWithPayload<"FEED_FUTURE_SLICE_LOAD_FAILED", {
    feedName: string;
}>;
export const feedFutureSliceLoadFailed = (feedName: string): FeedFutureSliceLoadFailedAction =>
    actionWithPayload("FEED_FUTURE_SLICE_LOAD_FAILED", {feedName});

export type FeedPastSliceSetAction = ActionWithPayload<"FEED_PAST_SLICE_SET", {
    feedName: string;
    stories: StoryInfo[];
    before: number;
    after: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const feedPastSliceSet = (
    feedName: string, stories: StoryInfo[], before: number, after: number, totalInPast: number, totalInFuture: number
): FeedPastSliceSetAction =>
    actionWithPayload("FEED_PAST_SLICE_SET", {feedName, stories, before, after, totalInPast, totalInFuture});

export type FeedFutureSliceSetAction = ActionWithPayload<"FEED_FUTURE_SLICE_SET", {
    feedName: string;
    stories: StoryInfo[];
    before: number;
    after: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const feedFutureSliceSet = (
    feedName: string, stories: StoryInfo[], before: number, after: number, totalInPast: number, totalInFuture: number
): FeedFutureSliceSetAction =>
    actionWithPayload("FEED_FUTURE_SLICE_SET", {feedName, stories, before, after, totalInPast, totalInFuture});

export type FeedSliceUpdateAction = ActionWithPayload<"FEED_SLICE_UPDATE", {
    feedName: string;
    stories: StoryInfo[];
    before: number;
    after: number;
    totalInPast: number;
    totalInFuture: number;
}>;
export const feedSliceUpdate = (
    feedName: string, stories: StoryInfo[], before: number, after: number, totalInPast: number, totalInFuture: number
): FeedSliceUpdateAction =>
    actionWithPayload("FEED_SLICE_UPDATE", {feedName, stories, before, after, totalInPast, totalInFuture});

export type FeedsUnsetAction = ActionWithoutPayload<"FEEDS_UNSET">;
export const feedsUnset = (): FeedsUnsetAction =>
    actionWithoutPayload("FEEDS_UNSET");

export type FeedsUpdateAction = ActionWithoutPayload<"FEEDS_UPDATE">;
export const feedsUpdate = (): FeedsUpdateAction =>
    actionWithoutPayload("FEEDS_UPDATE");

export type FeedScrolledAction = ActionWithPayload<"FEED_SCROLLED", {
    feedName: string;
    at: number;
}>;
export const feedScrolled = (feedName: string, at: number): FeedScrolledAction =>
    actionWithPayload("FEED_SCROLLED", {feedName, at});

export type FeedScrollToAnchorAction = ActionWithPayload<"FEED_SCROLL_TO_ANCHOR", {
    feedName: string;
    at: number;
}>;
export const feedScrollToAnchor = (feedName: string, at: number): FeedScrollToAnchorAction =>
    actionWithPayload("FEED_SCROLL_TO_ANCHOR", {feedName, at});

export type FeedScrolledToAnchorAction = ActionWithPayload<"FEED_SCROLLED_TO_ANCHOR", {
    feedName: string;
}>;
export const feedScrolledToAnchor = (feedName: string): FeedScrolledToAnchorAction =>
    actionWithPayload("FEED_SCROLLED_TO_ANCHOR", {feedName});

export type FeedsAnyAction =
    FeedGeneralLoadAction
    | FeedGeneralLoadFailedAction
    | FeedGeneralSetAction
    | FeedGeneralUnsetAction
    | FeedSubscribeAction
    | FeedSubscribedAction
    | FeedSubscribeFailedAction
    | FeedUnsubscribeAction
    | FeedUnsubscribedAction
    | FeedUnsubscribeFailedAction
    | FeedSubscriberSetVisibilityAction
    | FeedSubscriptionSetVisibilityAction
    | FeedSubscriberUpdatedAction
    | FeedSubscriptionUpdatedAction
    | FeedStatusLoadAction
    | FeedStatusLoadFailedAction
    | FeedStatusSetAction
    | FeedStatusUpdateAction
    | FeedStatusUpdateFailedAction
    | FeedStatusUpdatedAction
    | FeedPastSliceLoadAction
    | FeedPastSliceLoadFailedAction
    | FeedFutureSliceLoadAction
    | FeedFutureSliceLoadFailedAction
    | FeedPastSliceSetAction
    | FeedFutureSliceSetAction
    | FeedSliceUpdateAction
    | FeedsUnsetAction
    | FeedsUpdateAction
    | FeedScrolledAction
    | FeedScrollToAnchorAction
    | FeedScrolledToAnchorAction;

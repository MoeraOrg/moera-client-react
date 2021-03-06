import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { AvatarImage, FeedInfo, FeedStatus, StoryInfo, SubscriberInfo } from "api/node/api-types";

export const FEED_GENERAL_LOAD = "FEED_GENERAL_LOAD";
type FeedGeneralLoadAction = ActionWithPayload<typeof FEED_GENERAL_LOAD, {
    feedName: string;
}>;
export const feedGeneralLoad = (feedName: string): FeedGeneralLoadAction => ({
    type: FEED_GENERAL_LOAD,
    payload: {feedName}
});

export const FEED_GENERAL_LOAD_FAILED = "FEED_GENERAL_LOAD_FAILED";
type FeedGeneralLoadFailedAction = ActionWithPayload<typeof FEED_GENERAL_LOAD_FAILED, {
    feedName: string;
}>;
export const feedGeneralLoadFailed = (feedName: string): FeedGeneralLoadFailedAction => ({
    type: FEED_GENERAL_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_GENERAL_SET = "FEED_GENERAL_SET";
type FeedGeneralSetAction = ActionWithPayload<typeof FEED_GENERAL_SET, {
    feedName: string;
    info: FeedInfo;
}>;
export const feedGeneralSet = (feedName: string, info: FeedInfo): FeedGeneralSetAction => ({
    type: FEED_GENERAL_SET,
    payload: {feedName, info}
});

export const FEED_GENERAL_UNSET = "FEED_GENERAL_UNSET";
type FeedGeneralUnsetAction = ActionWithPayload<typeof FEED_GENERAL_UNSET, {
    feedName: string;
}>;
export const feedGeneralUnset = (feedName: string): FeedGeneralUnsetAction => ({
    type: FEED_GENERAL_UNSET,
    payload: {feedName}
});

export const FEED_SUBSCRIBE = "FEED_SUBSCRIBE";
type FeedSubscribeAction = ActionWithPayload<typeof FEED_SUBSCRIBE, {
    nodeName: string;
    feedName: string;
}>;
export const feedSubscribe = (nodeName: string, feedName: string): FeedSubscribeAction => ({
    type: FEED_SUBSCRIBE,
    payload: {nodeName, feedName}
});

export const FEED_SUBSCRIBED = "FEED_SUBSCRIBED";
type FeedSubscribedAction = ActionWithPayload<typeof FEED_SUBSCRIBED, {
    nodeName: string;
    fullName: string | null;
    avatar: AvatarImage | null;
    feedName: string;
    subscriber: SubscriberInfo;
}>;
export const feedSubscribed = (nodeName: string, fullName: string | null, avatar: AvatarImage | null, feedName: string,
                               subscriber: SubscriberInfo): FeedSubscribedAction => ({
    type: FEED_SUBSCRIBED,
    payload: {nodeName, fullName, avatar, feedName, subscriber}
});

export const FEED_SUBSCRIBE_FAILED = "FEED_SUBSCRIBE_FAILED";
type FeedSubscribeFailedAction = ActionWithPayload<typeof FEED_SUBSCRIBE_FAILED, {
    nodeName: string;
    feedName: string;
}>;
export const feedSubscribeFailed = (nodeName: string, feedName: string): FeedSubscribeFailedAction => ({
    type: FEED_SUBSCRIBE_FAILED,
    payload: {nodeName, feedName}
});

export const FEED_UNSUBSCRIBE = "FEED_UNSUBSCRIBE";
type FeedUnsubscribeAction = ActionWithPayload<typeof FEED_UNSUBSCRIBE, {
    nodeName: string;
    feedName: string;
    subscriberId: string;
}>;
export const feedUnsubscribe = (nodeName: string, feedName: string, subscriberId: string): FeedUnsubscribeAction => ({
    type: FEED_UNSUBSCRIBE,
    payload: {nodeName, feedName, subscriberId}
});

export const FEED_UNSUBSCRIBED = "FEED_UNSUBSCRIBED";
type FeedUnsubscribedAction = ActionWithPayload<typeof FEED_UNSUBSCRIBED, {
    nodeName: string;
    feedName: string;
}>;
export const feedUnsubscribed = (nodeName: string, feedName: string): FeedUnsubscribedAction => ({
    type: FEED_UNSUBSCRIBED,
    payload: {nodeName, feedName}
});

export const FEED_UNSUBSCRIBE_FAILED = "FEED_UNSUBSCRIBE_FAILED";
type FeedUnsubscribeFailedAction = ActionWithPayload<typeof FEED_UNSUBSCRIBE_FAILED, {
    nodeName: string;
    feedName: string;
}>;
export const feedUnsubscribeFailed = (nodeName: string, feedName: string): FeedUnsubscribeFailedAction => ({
    type: FEED_UNSUBSCRIBE_FAILED,
    payload: {nodeName, feedName}
});

export const FEED_STATUS_LOAD = "FEED_STATUS_LOAD";
type FeedStatusLoadAction = ActionWithPayload<typeof FEED_STATUS_LOAD, {
    feedName: string;
}>;
export const feedStatusLoad = (feedName: string): FeedStatusLoadAction => ({
    type: FEED_STATUS_LOAD,
    payload: {feedName}
});

export const FEED_STATUS_LOAD_FAILED = "FEED_STATUS_LOAD_FAILED";
type FeedStatusLoadFailedAction = ActionWithPayload<typeof FEED_STATUS_LOAD_FAILED, {
    feedName: string;
}>;
export const feedStatusLoadFailed = (feedName: string): FeedStatusLoadFailedAction => ({
    type: FEED_STATUS_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_STATUS_SET = "FEED_STATUS_SET";
type FeedStatusSetAction = ActionWithPayload<typeof FEED_STATUS_SET, {
    feedName: string;
    status: FeedStatus;
}>;
export const feedStatusSet = (feedName: string, status: FeedStatus): FeedStatusSetAction => ({
    type: FEED_STATUS_SET,
    payload: {feedName, status}
});

export const FEED_STATUS_UPDATE = "FEED_STATUS_UPDATE";
type FeedStatusUpdateAction = ActionWithPayload<typeof FEED_STATUS_UPDATE, {
    feedName: string;
    viewed: boolean;
    read: boolean;
    before: number;
}>;
export const feedStatusUpdate = (feedName: string, viewed: boolean, read: boolean,
                                 before: number): FeedStatusUpdateAction => ({
    type: FEED_STATUS_UPDATE,
    payload: {feedName, viewed, read, before}
});

export const FEED_STATUS_UPDATE_FAILED = "FEED_STATUS_UPDATE_FAILED";
type FeedStatusUpdateFailedAction = ActionWithPayload<typeof FEED_STATUS_UPDATE_FAILED, {
    feedName: string;
}>;
export const feedStatusUpdateFailed = (feedName: string): FeedStatusUpdateFailedAction => ({
    type: FEED_STATUS_UPDATE_FAILED,
    payload: {feedName}
});

export const FEED_STATUS_UPDATED = "FEED_STATUS_UPDATED";
type FeedStatusUpdatedAction = ActionWithPayload<typeof FEED_STATUS_UPDATED, {
    feedName: string;
    viewed: boolean;
    read: boolean;
    before: number;
}>;
export const feedStatusUpdated = (feedName: string, viewed: boolean, read: boolean,
                                  before: number): FeedStatusUpdatedAction => ({
    type: FEED_STATUS_UPDATED,
    payload: {feedName, viewed, read, before}
});

export const FEED_PAST_SLICE_LOAD = "FEED_PAST_SLICE_LOAD";
type FeedPastSliceLoadAction = ActionWithPayload<typeof FEED_PAST_SLICE_LOAD, {
    feedName: string;
}>;
export const feedPastSliceLoad = (feedName: string): FeedPastSliceLoadAction => ({
    type: FEED_PAST_SLICE_LOAD,
    payload: {feedName}
});

export const FEED_PAST_SLICE_LOAD_FAILED = "FEED_PAST_SLICE_LOAD_FAILED";
type FeedPastSliceLoadFailedAction = ActionWithPayload<typeof FEED_PAST_SLICE_LOAD_FAILED, {
    feedName: string;
}>;
export const feedPastSliceLoadFailed = (feedName: string): FeedPastSliceLoadFailedAction => ({
    type: FEED_PAST_SLICE_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_FUTURE_SLICE_LOAD = "FEED_FUTURE_SLICE_LOAD";
type FeedFutureSliceLoadAction = ActionWithPayload<typeof FEED_FUTURE_SLICE_LOAD, {
    feedName: string;
}>;
export const feedFutureSliceLoad = (feedName: string): FeedFutureSliceLoadAction => ({
    type: FEED_FUTURE_SLICE_LOAD,
    payload: {feedName}
});

export const FEED_FUTURE_SLICE_LOAD_FAILED = "FEED_FUTURE_SLICE_LOAD_FAILED";
type FeedFutureSliceLoadFailedAction = ActionWithPayload<typeof FEED_FUTURE_SLICE_LOAD_FAILED, {
    feedName: string;
}>;
export const feedFutureSliceLoadFailed = (feedName: string): FeedFutureSliceLoadFailedAction => ({
    type: FEED_FUTURE_SLICE_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_PAST_SLICE_SET = "FEED_PAST_SLICE_SET";
type FeedPastSliceSetAction = ActionWithPayload<typeof FEED_PAST_SLICE_SET, {
    feedName: string;
    stories: StoryInfo[];
    before: number;
    after: number;
}>;
export const feedPastSliceSet = (feedName: string, stories: StoryInfo[],
                                 before: number, after: number): FeedPastSliceSetAction => ({
    type: FEED_PAST_SLICE_SET,
    payload: {feedName, stories, before, after}
});

export const FEED_FUTURE_SLICE_SET = "FEED_FUTURE_SLICE_SET";
type FeedFutureSliceSetAction = ActionWithPayload<typeof FEED_FUTURE_SLICE_SET, {
    feedName: string;
    stories: StoryInfo[];
    before: number;
    after: number;
}>;
export const feedFutureSliceSet = (feedName: string, stories: StoryInfo[],
                                   before: number, after: number): FeedFutureSliceSetAction => ({
    type: FEED_FUTURE_SLICE_SET,
    payload: {feedName, stories, before, after}
});

export const FEED_SLICE_UPDATE = "FEED_SLICE_UPDATE";
type FeedSliceUpdateAction = ActionWithPayload<typeof FEED_SLICE_UPDATE, {
    feedName: string;
    stories: StoryInfo[];
    before: number;
    after: number;
}>;
export const feedSliceUpdate = (feedName: string, stories: StoryInfo[],
                                before: number, after: number): FeedSliceUpdateAction => ({
    type: FEED_SLICE_UPDATE,
    payload: {feedName, stories, before, after}
});

export const FEEDS_UNSET = "FEEDS_UNSET";
type FeedsUnsetAction = Action<typeof FEEDS_UNSET>;
export const feedsUnset = (): FeedsUnsetAction => ({
    type: FEEDS_UNSET
});

export const FEEDS_UPDATE = "FEEDS_UPDATE";
type FeedsUpdateAction = Action<typeof FEEDS_UPDATE>;
export const feedsUpdate = (): FeedsUpdateAction => ({
    type: FEEDS_UPDATE
});

export const FEED_SCROLLED = "FEED_SCROLLED";
type FeedScrolledAction = ActionWithPayload<typeof FEED_SCROLLED, {
    feedName: string;
    at: number;
}>;
export const feedScrolled = (feedName: string, at: number): FeedScrolledAction => ({
    type: FEED_SCROLLED,
    payload: {feedName, at}
});

export const FEED_SCROLL_TO_ANCHOR = "FEED_SCROLL_TO_ANCHOR";
type FeedScrollToAnchorAction = ActionWithPayload<typeof FEED_SCROLL_TO_ANCHOR, {
    feedName: string;
    at: number;
}>;
export const feedScrollToAnchor = (feedName: string, at: number): FeedScrollToAnchorAction => ({
    type: FEED_SCROLL_TO_ANCHOR,
    payload: {feedName, at}
});

export const FEED_SCROLLED_TO_ANCHOR = "FEED_SCROLLED_TO_ANCHOR";
type FeedScrolledToAnchorAction = ActionWithPayload<typeof FEED_SCROLLED_TO_ANCHOR, {
    feedName: string;
}>;
export const feedScrolledToAnchor = (feedName: string): FeedScrolledToAnchorAction => ({
    type: FEED_SCROLLED_TO_ANCHOR,
    payload: {feedName}
});

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

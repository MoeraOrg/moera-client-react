export const FEED_GENERAL_LOAD = "FEED_GENERAL_LOAD";
export const feedGeneralLoad = (feedName) => ({
    type: FEED_GENERAL_LOAD,
    payload: {feedName}
});

export const FEED_GENERAL_LOAD_FAILED = "FEED_GENERAL_LOAD_FAILED";
export const feedGeneralLoadFailed = (feedName) => ({
    type: FEED_GENERAL_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_GENERAL_SET = "FEED_GENERAL_SET";
export const feedGeneralSet = (feedName, info) => ({
    type: FEED_GENERAL_SET,
    payload: {feedName, info}
});

export const FEED_GENERAL_UNSET = "FEED_GENERAL_UNSET";
export const feedGeneralUnset = (feedName) => ({
    type: FEED_GENERAL_UNSET,
    payload: {feedName}
});

export const FEED_SUBSCRIBE = "FEED_SUBSCRIBE";
export const feedSubscribe = (nodeName, feedName) => ({
    type: FEED_SUBSCRIBE,
    payload: {nodeName, feedName}
});

export const FEED_SUBSCRIBED = "FEED_SUBSCRIBED";
export const feedSubscribed = (nodeName, fullName, feedName, subscriber) => ({
    type: FEED_SUBSCRIBED,
    payload: {nodeName, fullName, feedName, subscriber}
});

export const FEED_SUBSCRIBE_FAILED = "FEED_SUBSCRIBE_FAILED";
export const feedSubscribeFailed = (nodeName, feedName) => ({
    type: FEED_SUBSCRIBE_FAILED,
    payload: {nodeName, feedName}
});

export const FEED_UNSUBSCRIBE = "FEED_UNSUBSCRIBE";
export const feedUnsubscribe = (nodeName, feedName, subscriberId) => ({
    type: FEED_UNSUBSCRIBE,
    payload: {nodeName, feedName, subscriberId}
});

export const FEED_UNSUBSCRIBED = "FEED_UNSUBSCRIBED";
export const feedUnsubscribed = (nodeName, feedName) => ({
    type: FEED_UNSUBSCRIBED,
    payload: {nodeName, feedName}
});

export const FEED_UNSUBSCRIBE_FAILED = "FEED_UNSUBSCRIBE_FAILED";
export const feedUnsubscribeFailed = (nodeName, feedName) => ({
    type: FEED_UNSUBSCRIBE_FAILED,
    payload: {nodeName, feedName}
});

export const FEED_STATUS_LOAD = "FEED_STATUS_LOAD";
export const feedStatusLoad = (feedName) => ({
    type: FEED_STATUS_LOAD,
    payload: {feedName}
});

export const FEED_STATUS_LOAD_FAILED = "FEED_STATUS_LOAD_FAILED";
export const feedStatusLoadFailed = (feedName) => ({
    type: FEED_STATUS_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_STATUS_SET = "FEED_STATUS_SET";
export const feedStatusSet = (feedName, status) => ({
    type: FEED_STATUS_SET,
    payload: {feedName, status}
});

export const FEED_STATUS_UPDATE = "FEED_STATUS_UPDATE";
export const feedStatusUpdate = (feedName, viewed, read, before) => ({
    type: FEED_STATUS_UPDATE,
    payload: {feedName, viewed, read, before}
});

export const FEED_STATUS_UPDATE_FAILED = "FEED_STATUS_UPDATE_FAILED";
export const feedStatusUpdateFailed = (feedName) => ({
    type: FEED_STATUS_UPDATE_FAILED,
    payload: {feedName}
});

export const FEED_STATUS_UPDATED = "FEED_STATUS_UPDATED";
export const feedStatusUpdated = (feedName, viewed, read, before) => ({
    type: FEED_STATUS_UPDATED,
    payload: {feedName, viewed, read, before}
});

export const FEED_PAST_SLICE_LOAD = "FEED_PAST_SLICE_LOAD";
export const feedPastSliceLoad = (feedName) => ({
    type: FEED_PAST_SLICE_LOAD,
    payload: {feedName}
});

export const FEED_PAST_SLICE_LOAD_FAILED = "FEED_PAST_SLICE_LOAD_FAILED";
export const feedPastSliceLoadFailed = (feedName) => ({
    type: FEED_PAST_SLICE_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_FUTURE_SLICE_LOAD = "FEED_FUTURE_SLICE_LOAD";
export const feedFutureSliceLoad = (feedName) => ({
    type: FEED_FUTURE_SLICE_LOAD,
    payload: {feedName}
});

export const FEED_FUTURE_SLICE_LOAD_FAILED = "FEED_FUTURE_SLICE_LOAD_FAILED";
export const feedFutureSliceLoadFailed = (feedName) => ({
    type: FEED_FUTURE_SLICE_LOAD_FAILED,
    payload: {feedName}
});

export const FEED_PAST_SLICE_SET = "FEED_PAST_SLICE_SET";
export const feedPastSliceSet = (feedName, stories, before, after) => ({
    type: FEED_PAST_SLICE_SET,
    payload: {feedName, stories, before, after}
});

export const FEED_FUTURE_SLICE_SET = "FEED_FUTURE_SLICE_SET";
export const feedFutureSliceSet = (feedName, stories, before, after) => ({
    type: FEED_FUTURE_SLICE_SET,
    payload: {feedName, stories, before, after}
});

export const FEED_SLICE_UPDATE = "FEED_SLICE_UPDATE";
export const feedSliceUpdate = (feedName, stories, before, after) => ({
    type: FEED_SLICE_UPDATE,
    payload: {feedName, stories, before, after}
});

export const FEEDS_UNSET = "FEEDS_UNSET";
export const feedsUnset = () => ({
    type: FEEDS_UNSET
});

export const FEEDS_UPDATE = "FEEDS_UPDATE";
export const feedsUpdate = () => ({
    type: FEEDS_UPDATE
});

export const FEED_SCROLLED = "FEED_SCROLLED";
export const feedScrolled = (feedName, at) => ({
    type: FEED_SCROLLED,
    payload: {feedName, at}
});

export const FEED_SCROLL_TO_ANCHOR = "FEED_SCROLL_TO_ANCHOR";
export const feedScrollToAnchor = (feedName, at) => ({
    type: FEED_SCROLL_TO_ANCHOR,
    payload: {feedName, at}
});

export const FEED_SCROLLED_TO_ANCHOR = "FEED_SCROLLED_TO_ANCHOR";
export const feedScrolledToAnchor = (feedName) => ({
    type: FEED_SCROLLED_TO_ANCHOR,
    payload: {feedName}
});

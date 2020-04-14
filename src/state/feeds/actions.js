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

export const FEEDS_UNSET = "FEEDS_UNSET";
export const feedsUnset = () => ({
    type: FEEDS_UNSET
});

export const FEED_SCROLLED = "FEED_SCROLLED";
export const feedScrolled = (feedName, at) => ({
    type: FEED_SCROLLED,
    payload: {feedName, at}
});

export const FEED_SCROLLED_TO_ANCHOR = "FEED_SCROLLED_TO_ANCHOR";
export const feedScrolledToAnchor = (feedName) => ({
    type: FEED_SCROLLED_TO_ANCHOR,
    payload: {feedName}
});

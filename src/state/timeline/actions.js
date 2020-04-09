export const TIMELINE_GENERAL_LOAD = "TIMELINE_GENERAL_LOAD";
export const timelineGeneralLoad = () => ({
    type: TIMELINE_GENERAL_LOAD
});

export const TIMELINE_GENERAL_LOAD_FAILED = "TIMELINE_GENERAL_LOAD_FAILED";
export const timelineGeneralLoadFailed = () => ({
    type: TIMELINE_GENERAL_LOAD_FAILED
});

export const TIMELINE_GENERAL_SET = "TIMELINE_GENERAL_SET";
export const timelineGeneralSet = (info) => ({
    type: TIMELINE_GENERAL_SET,
    payload: {info}
});

export const TIMELINE_PAST_SLICE_LOAD = "TIMELINE_PAST_SLICE_LOAD";
export const timelinePastSliceLoad = () => ({
    type: TIMELINE_PAST_SLICE_LOAD
});

export const TIMELINE_PAST_SLICE_LOAD_FAILED = "TIMELINE_PAST_SLICE_LOAD_FAILED";
export const timelinePastSliceLoadFailed = () => ({
    type: TIMELINE_PAST_SLICE_LOAD_FAILED
});

export const TIMELINE_FUTURE_SLICE_LOAD = "TIMELINE_FUTURE_SLICE_LOAD";
export const timelineFutureSliceLoad = () => ({
    type: TIMELINE_FUTURE_SLICE_LOAD
});

export const TIMELINE_FUTURE_SLICE_LOAD_FAILED = "TIMELINE_FUTURE_SLICE_LOAD_FAILED";
export const timelineFutureSliceLoadFailed = () => ({
    type: TIMELINE_FUTURE_SLICE_LOAD_FAILED
});

export const TIMELINE_PAST_SLICE_SET = "TIMELINE_PAST_SLICE_SET";
export const timelinePastSliceSet = (stories, before, after) => ({
    type: TIMELINE_PAST_SLICE_SET,
    payload: {stories, before, after}
});

export const TIMELINE_FUTURE_SLICE_SET = "TIMELINE_FUTURE_SLICE_SET";
export const timelineFutureSliceSet = (stories, before, after) => ({
    type: TIMELINE_FUTURE_SLICE_SET,
    payload: {stories, before, after}
});

export const TIMELINE_UNSET = "TIMELINE_UNSET";
export const timelineUnset = () => ({
    type: TIMELINE_UNSET
});

export const TIMELINE_SCROLLED = "TIMELINE_SCROLLED";
export const timelineScrolled = (at) => ({
    type: TIMELINE_SCROLLED,
    payload: {at}
});

export const TIMELINE_SCROLLED_TO_ANCHOR = "TIMELINE_SCROLLED_TO_ANCHOR";
export const timelineScrolledToAnchor = () => ({
    type: TIMELINE_SCROLLED_TO_ANCHOR
});

export const TIMELINE_STORY_ADDED = "TIMELINE_STORY_ADDED";
export const timelineStoryAdded = (id, postingId, moment) => ({
    type: TIMELINE_STORY_ADDED,
    payload: {id, postingId, moment}
});

export const TIMELINE_STORY_DELETED = "TIMELINE_STORY_DELETED";
export const timelineStoryDeleted = (id, moment) => ({
    type: TIMELINE_STORY_DELETED,
    payload: {id, moment}
});

export const TIMELINE_STORY_UPDATED = "TIMELINE_STORY_UPDATED";
export const timelineStoryUpdated = (id, postingId, moment) => ({
    type: TIMELINE_STORY_UPDATED,
    payload: {id, postingId, moment}
});

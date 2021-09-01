import { FeedState } from "state/feeds/state";

export const emptyInfo = {
    subscriberId: null,
    operations: {
        add: []
    }
};

export const emptyFeed: FeedState = {
    loadingGeneral: false,
    loadedGeneral: false,
    subscribing: false,
    unsubscribing: false,
    ...emptyInfo,
    loadingStatus: false,
    loadedStatus: false,
    notViewed: 0,
    notRead: 0,
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    stories: [],
    total: 0,
    totalPinned: 0,
    totalInPast: 0,
    totalInFuture: 0,
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

import { FeedState } from "state/feeds/state";
import { FeedStatus } from "api/node/api-types";

export const emptyInfo = {
    subscriberId: null,
    operations: {
        add: "none"
    }
};

const emptyStatus: FeedStatus = {
    total: 0,
    totalPinned: 0,
    notViewed: 0,
    notRead: 0,
    notViewedMoment: null
}

export const emptyFeed: FeedState = {
    loadingGeneral: false,
    loadedGeneral: false,
    subscribing: false,
    unsubscribing: false,
    ...emptyInfo,
    loadingStatus: false,
    loadedStatus: false,
    status: emptyStatus,
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    stories: [],
    totalInPast: 0,
    totalInFuture: 0,
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

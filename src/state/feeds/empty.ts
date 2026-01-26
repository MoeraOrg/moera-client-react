import { FeedInfo, FeedStatus } from "api";
import { FeedState } from "state/feeds/state";

export const emptyInfo: Omit<FeedInfo, "feedName"> = {
    total: 0,
    operations: {
        add: "none" as const
    }
};

const emptyStatus: FeedStatus = {
    total: 0,
    totalPinned: 0,
    notViewed: 0,
    notRead: 0,
    notViewedMoment: null,
    notReadMoment: null
}

export const emptyFeed: FeedState = {
    loadingGeneral: false,
    loadedGeneral: false,
    ...emptyInfo,
    loadingStatus: false,
    loadedStatus: false,
    status: emptyStatus,
    loadingFuture: false,
    loadingPast: false,
    cannotBeLoaded: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    stories: [],
    pending: [],
    totalInPast: 0,
    totalInFuture: 0,
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

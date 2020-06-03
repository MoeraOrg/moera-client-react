export const emptyInfo = {
    subscriberId: null,
    operations: {
        add: []
    }
};

export const emptyFeed = {
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
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

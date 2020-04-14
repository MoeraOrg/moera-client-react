export const emptyInfo = {
    operations: {
        add: []
    }
};

export const emptyFeed = {
    loadingGeneral: false,
    loadedGeneral: false,
    ...emptyInfo,
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    stories: [],
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

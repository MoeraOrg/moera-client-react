export const PEOPLE_GO_TO_TAB = "PEOPLE_GO_TO_TAB";
export const peopleGoToTab = (tab) => ({
    type: PEOPLE_GO_TO_TAB,
    payload: {tab}
});

export const PEOPLE_GENERAL_LOAD = "PEOPLE_GENERAL_LOAD";
export const peopleGeneralLoad = () => ({
    type: PEOPLE_GENERAL_LOAD
});

export const PEOPLE_GENERAL_LOADED = "PEOPLE_GENERAL_LOADED";
export const peopleGeneralLoaded = (info) => ({
    type: PEOPLE_GENERAL_LOADED,
    payload: {info}
});

export const PEOPLE_GENERAL_LOAD_FAILED = "PEOPLE_GENERAL_LOAD_FAILED";
export const peopleGeneralLoadFailed = () => ({
    type: PEOPLE_GENERAL_LOAD_FAILED
});

export const SUBSCRIBERS_LOAD = "SUBSCRIBERS_LOAD";
export const subscribersLoad = () => ({
    type: SUBSCRIBERS_LOAD
});

export const SUBSCRIBERS_LOADED = "SUBSCRIBERS_LOADED";
export const subscribersLoaded = (list) => ({
    type: SUBSCRIBERS_LOADED,
    payload: {list}
});

export const SUBSCRIBERS_LOAD_FAILED = "SUBSCRIBERS_LOAD_FAILED";
export const subscribersLoadFailed = () => ({
    type: SUBSCRIBERS_LOAD_FAILED
});

export const SUBSCRIPTIONS_LOAD = "SUBSCRIPTIONS_LOAD";
export const subscriptionsLoad = () => ({
    type: SUBSCRIPTIONS_LOAD
});

export const SUBSCRIPTIONS_LOADED = "SUBSCRIPTIONS_LOADED";
export const subscriptionsLoaded = (list) => ({
    type: SUBSCRIPTIONS_LOADED,
    payload: {list}
});

export const SUBSCRIPTIONS_LOAD_FAILED = "SUBSCRIPTIONS_LOAD_FAILED";
export const subscriptionsLoadFailed = () => ({
    type: SUBSCRIPTIONS_LOAD_FAILED
});

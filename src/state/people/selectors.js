export function isPeopleGeneralToBeLoaded(state) {
    return !state.people.loadedGeneral && !state.people.loadingGeneral;
}

export function isAtSubscribersTab(state) {
    return state.people.tab === "subscribers";
}

export function isAtSubscriptionsTab(state) {
    return state.people.tab === "subscriptions";
}

export function isSubscribersToBeLoaded(state) {
    return !state.people.loadedSubscribers && !state.people.loadingSubscribers;
}

export function isSubscriptionsToBeLoaded(state) {
    return !state.people.loadedSubscriptions && !state.people.loadingSubscriptions;
}

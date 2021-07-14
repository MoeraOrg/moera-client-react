import { ClientState } from "state/state";

export function isPeopleGeneralToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedGeneral && !state.people.loadingGeneral;
}

export function isAtSubscribersTab(state: ClientState): boolean {
    return state.people.tab === "subscribers";
}

export function isAtSubscriptionsTab(state: ClientState): boolean {
    return state.people.tab === "subscriptions";
}

export function isSubscribersToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedSubscribers && !state.people.loadingSubscribers;
}

export function isSubscriptionsToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedSubscriptions && !state.people.loadingSubscriptions;
}

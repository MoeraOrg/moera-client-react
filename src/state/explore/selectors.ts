import { ClientState } from "state/state";

export function isActivePeopleToBeLoaded(state: ClientState): boolean {
    return !state.explore.loadedActivePeople && !state.explore.loadingActivePeople;
}

export function isActivePeopleLoaded(state: ClientState): boolean {
    return state.explore.loadedActivePeople && !state.explore.loadingActivePeople;
}

export function isTrendingToBeLoaded(state: ClientState): boolean {
    return !state.explore.loadedTrending && !state.explore.loadingTrending;
}

export function isTrendingLoaded(state: ClientState): boolean {
    return state.explore.loadedTrending && !state.explore.loadingTrending;
}

export function isDiscussionsToBeLoaded(state: ClientState): boolean {
    return !state.explore.loadedDiscussions && !state.explore.loadingDiscussions;
}

export function isDiscussionsLoaded(state: ClientState): boolean {
    return state.explore.loadedDiscussions && !state.explore.loadingDiscussions;
}

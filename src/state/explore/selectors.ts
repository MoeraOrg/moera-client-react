import { ClientState } from "state/state";

export function isActivePeopleToBeLoaded(state: ClientState): boolean {
    return !state.explore.loadedActivePeople && !state.explore.loadingActivePeople;
}

export function isActivePeopleLoaded(state: ClientState): boolean {
    return state.explore.loadedActivePeople && !state.explore.loadingActivePeople;
}

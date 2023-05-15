import { ClientState } from "state/state";

export function isFutureComplainGroupsToBeLoaded(state: ClientState): boolean {
    return !state.complains.loadingFuture && state.complains.before < Number.MAX_SAFE_INTEGER;
}

export function isPastComplainGroupsToBeLoaded(state: ClientState): boolean {
    return !state.complains.loadingPast
        && state.complains.before === state.complains.after
        && state.complains.after > Number.MIN_SAFE_INTEGER;
}

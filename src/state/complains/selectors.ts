import { ClientState } from "state/state";
import { ExtComplainGroupInfo } from "state/complains/state";

export function isFutureComplainGroupsToBeLoaded(state: ClientState): boolean {
    return !state.complains.loadingFuture && state.complains.before < Number.MAX_SAFE_INTEGER;
}

export function isPastComplainGroupsToBeLoaded(state: ClientState): boolean {
    return !state.complains.loadingPast
        && state.complains.before === state.complains.after
        && state.complains.after > Number.MIN_SAFE_INTEGER;
}

export function getComplainGroup(state: ClientState, id: string | null): ExtComplainGroupInfo | null {
    return id != null ? state.complains.complainGroups[id] ?? null : null;
}

export function getActiveComplainGroupId(state: ClientState): string | null {
    return state.complains.activeComplainGroupId;
}

export function getActiveComplainGroup(state: ClientState): ExtComplainGroupInfo | null {
    return getComplainGroup(state, getActiveComplainGroupId(state));
}

export function isActiveComplainGroupToBeLoaded(state: ClientState): boolean {
    return getActiveComplainGroup(state) == null && !state.complains.loadingActive;
}

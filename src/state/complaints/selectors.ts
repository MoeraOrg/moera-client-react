import { ClientState } from "state/state";
import { ExtComplaintGroupInfo } from "state/complaints/state";

export function isFutureComplaintGroupsToBeLoaded(state: ClientState): boolean {
    return !state.complaints.loadingFuture && state.complaints.before < Number.MAX_SAFE_INTEGER;
}

export function isPastComplaintGroupsToBeLoaded(state: ClientState): boolean {
    return !state.complaints.loadingPast
        && state.complaints.before === state.complaints.after
        && state.complaints.after > Number.MIN_SAFE_INTEGER;
}

export function getComplaintGroup(state: ClientState, id: string | null): ExtComplaintGroupInfo | null {
    return id != null ? state.complaints.complaintGroups[id] ?? null : null;
}

export function getActiveComplaintGroupId(state: ClientState): string | null {
    return state.complaints.activeComplaintGroupId;
}

export function getActiveComplaintGroup(state: ClientState): ExtComplaintGroupInfo | null {
    return getComplaintGroup(state, getActiveComplaintGroupId(state));
}

export function isActiveComplaintGroupToBeLoaded(state: ClientState): boolean {
    return getActiveComplaintGroup(state) == null && !state.complaints.loadingActive;
}

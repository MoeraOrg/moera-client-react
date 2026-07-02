import { ClientState } from "state/state";

export function isRefreshConfirmingReload(state: ClientState): boolean {
    return state.refresh.confirmingReload;
}

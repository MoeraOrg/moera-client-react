import { ClientState } from "state/state";

export function isSheriffOrderDetailsDialogToBeLoaded(state: ClientState): boolean {
    return !state.sheriffOrderDetailsDialog.loaded && !state.sheriffOrderDetailsDialog.loading
        && state.sheriffOrderDetailsDialog.nodeName != null && state.sheriffOrderDetailsDialog.id != null;
}

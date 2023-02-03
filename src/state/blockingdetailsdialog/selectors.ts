import { ClientState } from "state/state";

export function isBlockingDetailsDialogToBeLoaded(state: ClientState): boolean {
    return !state.blockingDetailsDialog.loaded && !state.blockingDetailsDialog.loading
        && state.blockingDetailsDialog.nodeName != null;
}

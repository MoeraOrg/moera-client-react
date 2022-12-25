import { ClientState } from "state/state";

export function isAskDialogToBeLoaded(state: ClientState): boolean {
    return !state.askDialog.loaded && !state.askDialog.loading && state.askDialog.nodeName != null;
}

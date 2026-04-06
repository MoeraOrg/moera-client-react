import { ClientState } from "state/state";

export function isMediaDownloadDialogShown(state: ClientState): boolean {
    return state.mediaDownloadDialog.show;
}

export function isMediaDownloadPending(state: ClientState): boolean {
    return state.mediaDownloadDialog.errorCode === "media.download-pending";
}

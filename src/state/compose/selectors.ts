import { PostingFeatures } from "api/node/api-types";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getNodeFeatures } from "state/node/selectors";

export function isComposePostingToBeLoaded(state: ClientState): boolean {
    return state.compose.postingId != null && state.compose.posting == null && !state.compose.loadingPosting;
}

export function isComposeDraftToBeLoaded(state: ClientState): boolean {
    return isConnectedToHome(state) && state.compose.postingId == null && state.compose.draftId != null
        && state.compose.draft == null && !state.compose.loadingDraft;
}

export function isComposeSharedTextToBeLoaded(state: ClientState): boolean {
    return state.compose.postingId == null && state.compose.draftId == null && state.compose.sharedText == null
        && !!window.Android;
}

export function getPostingFeatures(state: ClientState): PostingFeatures | null {
    return getNodeFeatures(state)?.posting ?? null;
}

export function getComposePostingId(state: ClientState): string | null {
    return state.compose.postingId;
}

export function isComposePostingEditing(state: ClientState): boolean {
    return getComposePostingId(state) != null;
}

export function isComposePosted(state: ClientState): boolean {
    return state.compose.posted;
}

export function getComposeDraftId(state: ClientState): string | null {
    return state.compose.draftId;
}

export function isComposeDraftListToBeLoaded(state: ClientState): boolean {
    return isConnectedToHome(state) && state.compose.postingId == null && !state.compose.loadedDraftList
        && !state.compose.loadingDraftList;
}

export function isComposeDraftListLoaded(state: ClientState): boolean {
    return state.compose.loadedDraftList && !state.compose.loadingDraftList;
}

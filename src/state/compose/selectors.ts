import { PostingFeatures } from "api/node/api-types";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { isAtComposePage, isAtDetailedPostingPage } from "state/navigation/selectors";

export function isAtComposeFeaturesPage(state: ClientState): boolean {
    return isAtComposePage(state) || isAtDetailedPostingPage(state);
}

export function isComposeFeaturesToBeLoaded(state: ClientState): boolean {
    return !state.compose.loadedFeatures && !state.compose.loadingFeatures;
}

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
    return state.compose.features;
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

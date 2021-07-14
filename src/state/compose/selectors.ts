import { ClientState } from "state/state";
import { ExtDraftInfo } from "state/compose/state";

export function isComposeFeaturesToBeLoaded(state: ClientState): boolean {
    return !state.compose.loadedFeatures && !state.compose.loadingFeatures;
}

export function isComposePostingToBeLoaded(state: ClientState): boolean {
    return state.compose.postingId != null && state.compose.posting == null && !state.compose.loadingPosting;
}

export function isComposeDraftToBeLoaded(state: ClientState): boolean {
    return state.compose.postingId == null && state.compose.draftId != null && state.compose.posting == null
        && !state.compose.loadingDraft;
}

export function isComposeSharedTextToBeLoaded(state: ClientState): boolean {
    return state.compose.postingId == null && state.compose.draftId == null && state.compose.sharedText == null
        && !!window.Android;
}

export function getComposePostingId(state: ClientState): string | null {
    return state.compose.postingId;
}

export function isComposePostingEditing(state: ClientState): boolean {
    return getComposePostingId(state) != null;
}

export function getComposeDraftId(state: ClientState): string | null {
    return state.compose.draftId;
}

export function getComposeDraft(state: ClientState): ExtDraftInfo | null {
    const draftId = getComposeDraftId(state);
    return draftId ? state.compose.draftList.find(d => d.id === draftId) ?? null : null;
}

export function isComposeDraftListToBeLoaded(state: ClientState): boolean {
    return state.compose.postingId == null && !state.compose.loadedDraftList && !state.compose.loadingDraftList;
}

export function isComposeDraftListLoaded(state: ClientState): boolean {
    return state.compose.loadedDraftList && !state.compose.loadingDraftList;
}
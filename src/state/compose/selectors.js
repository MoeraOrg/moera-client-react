export function isComposeFeaturesToBeLoaded(state) {
    return !state.compose.loadedFeatures && !state.compose.loadingFeatures;
}

export function isComposePostingToBeLoaded(state) {
    return state.compose.postingId != null && state.compose.posting == null && !state.compose.loadingPosting;
}

export function isComposeDraftToBeLoaded(state) {
    return state.compose.postingId == null && state.compose.draftId != null && state.compose.posting == null
        && !state.compose.loadingDraft;
}

export function getComposePostingId(state) {
    return state.compose.postingId;
}

export function getComposeDraftId(state) {
    return state.compose.draftId;
}

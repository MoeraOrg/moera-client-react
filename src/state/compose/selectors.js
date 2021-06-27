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

export function isComposeSharedTextToBeLoaded(state) {
    return state.compose.postingId == null && state.compose.draftId == null && state.compose.sharedText == null
        && window.Android;
}

export function getComposePostingId(state) {
    return state.compose.postingId;
}

export function isComposePostingEditing(state) {
    return getComposePostingId(state) != null;
}

export function getComposeDraftId(state) {
    return state.compose.draftId;
}

export function getComposeDraft(state) {
    const draftId = getComposeDraftId(state);
    return draftId ? state.compose.draftList.find(d => d.id === draftId) : null;
}

export function getComposeDraftRevision(state) {
    return state.compose.draftRevision;
}

export function isComposeDraftListToBeLoaded(state) {
    return state.compose.postingId == null && !state.compose.loadedDraftList && !state.compose.loadingDraftList;
}

export function isComposeDraftListLoaded(state) {
    return state.compose.loadedDraftList && !state.compose.loadingDraftList;
}

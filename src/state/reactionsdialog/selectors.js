function getReactions(state) {
    return state.reactionsDialog.reactions[state.reactionsDialog.activeTab ?? 0];
}

export function isReactionsDialogReactionsToBeLoaded(state) {
    return getReactionsDialogItems(state).length === 0;
}

export function isReactionsDialogReactionsLoading(state) {
    const reactions = getReactions(state);
    return reactions != null && reactions.loading;
}

export function getReactionsDialogItems(state) {
    const reactions = getReactions(state);
    return reactions != null ? reactions.items : [];
}

export function getReactionsDialogRemainingCount(state) {
    const reactions = getReactions(state);
    return reactions != null ? reactions.total - reactions.items.length : 0;
}

export function isReactionsDialogTotalsToBeLoaded(state) {
    return !state.reactionsDialog.totals.loaded && !state.reactionsDialog.totals.loading;
}

export function getReactionVerificationStatus(state, ownerName) {
    return state.reactionsDialog.verificationStatus[ownerName] ?? "none";
}

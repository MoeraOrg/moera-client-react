export const OPEN_REACTIONS_DIALOG = "OPEN_REACTIONS_DIALOG";
export const openReactionsDialog = (postingId, negative) => ({
    type: OPEN_REACTIONS_DIALOG,
    payload: {postingId, negative}
});

export const CLOSE_REACTIONS_DIALOG = "CLOSE_REACTIONS_DIALOG";
export const closeReactionsDialog = () => ({
    type: CLOSE_REACTIONS_DIALOG
});

export const REACTIONS_DIALOG_UNSET = "REACTIONS_DIALOG_UNSET";
export const reactionsDialogUnset = () => ({
    type: REACTIONS_DIALOG_UNSET
});

export const REACTIONS_DIALOG_PAST_REACTIONS_LOAD = "REACTIONS_DIALOG_PAST_REACTIONS_LOAD";
export const reactionsDialogPastReactionsLoad = () => ({
    type: REACTIONS_DIALOG_PAST_REACTIONS_LOAD
});

export const REACTIONS_DIALOG_PAST_REACTIONS_LOADED = "REACTIONS_DIALOG_PAST_REACTIONS_LOADED";
export const reactionsDialogPastReactionsLoaded = (reactions, postingId, negative, emoji, before, after, total) => ({
    type: REACTIONS_DIALOG_PAST_REACTIONS_LOADED,
    payload: {reactions, postingId, negative, emoji, before, after, total}
});

export const REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED = "REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED";
export const reactionsDialogPastReactionsLoadFailed = (postingId, negative, emoji) => ({
    type: REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED,
    payload: {postingId, negative, emoji}
});

export const REACTIONS_DIALOG_TOTALS_LOAD = "REACTIONS_DIALOG_TOTALS_LOAD";
export const reactionsDialogTotalsLoad = () => ({
    type: REACTIONS_DIALOG_TOTALS_LOAD
});

export const REACTIONS_DIALOG_TOTALS_LOADED = "REACTIONS_DIALOG_TOTALS_LOADED";
export const reactionsDialogTotalsLoaded = (positive, negative) => ({
    type: REACTIONS_DIALOG_TOTALS_LOADED,
    payload: {positive, negative}
});

export const REACTIONS_DIALOG_TOTALS_LOAD_FAILED = "REACTIONS_DIALOG_TOTALS_LOAD_FAILED";
export const reactionsDialogTotalsLoadFailed = () => ({
    type: REACTIONS_DIALOG_TOTALS_LOAD_FAILED
});

export const REACTIONS_DIALOG_SELECT_TAB = "REACTIONS_DIALOG_SELECT_TAB";
export const reactionsDialogSelectTab = (tab) => ({
    type: REACTIONS_DIALOG_SELECT_TAB,
    payload: {tab}
});

export const REACTION_VERIFY = "REACTION_VERIFY";
export const reactionVerify = (postingId, ownerName) => ({
    type: REACTION_VERIFY,
    payload: {postingId, ownerName}
});

export const REACTION_VERIFY_FAILED = "REACTION_VERIFY_FAILED";
export const reactionVerifyFailed = (postingId, ownerName) => ({
    type: REACTION_VERIFY_FAILED,
    payload: {postingId, ownerName}
});

export const COMPOSE_FEATURES_LOAD = "COMPOSE_FEATURES_LOAD";
export const composeFeaturesLoad = () => ({
    type: COMPOSE_FEATURES_LOAD
});

export const COMPOSE_FEATURES_LOADED = "COMPOSE_FEATURES_LOADED";
export const composeFeaturesLoaded = (features) => ({
    type: COMPOSE_FEATURES_LOADED,
    payload: {features}
});

export const COMPOSE_FEATURES_LOAD_FAILED = "COMPOSE_FEATURES_LOAD_FAILED";
export const composeFeaturesLoadFailed = () => ({
    type: COMPOSE_FEATURES_LOAD_FAILED
});

export const COMPOSE_FEATURES_UNSET = "COMPOSE_FEATURES_UNSET";
export const composeFeaturesUnset = () => ({
    type: COMPOSE_FEATURES_UNSET
});

export const COMPOSE_POSTING_LOAD = "COMPOSE_POSTING_LOAD";
export const composePostingLoad = () => ({
    type: COMPOSE_POSTING_LOAD
});

export const COMPOSE_POSTING_LOADED = "COMPOSE_POSTING_LOADED";
export const composePostingLoaded = (posting) => ({
    type: COMPOSE_POSTING_LOADED,
    payload: {posting}
});

export const COMPOSE_POSTING_LOAD_FAILED = "COMPOSE_POSTING_LOAD_FAILED";
export const composePostingLoadFailed = () => ({
    type: COMPOSE_POSTING_LOAD_FAILED
});

export const COMPOSE_CONFLICT = "COMPOSE_CONFLICT";
export const composeConflict = () => ({
    type: COMPOSE_CONFLICT
});

export const COMPOSE_CONFLICT_CLOSE = "COMPOSE_CONFLICT_CLOSE";
export const composeConflictClose = () => ({
    type: COMPOSE_CONFLICT_CLOSE
});

export const COMPOSE_POST = "COMPOSE_POST";
export const composePost = (id, draftId, postingText) => ({
    type: COMPOSE_POST,
    payload: {id, draftId, postingText}
});

export const COMPOSE_POST_SUCCEEDED = "COMPOSE_POST_SUCCEEDED";
export const composePostSucceeded = (posting) => ({
    type: COMPOSE_POST_SUCCEEDED,
    payload: {posting}
});

export const COMPOSE_POST_FAILED = "COMPOSE_POST_FAILED";
export const composePostFailed = () => ({
    type: COMPOSE_POST_FAILED
});

export const COMPOSE_DRAFT_LOAD = "COMPOSE_DRAFT_LOAD";
export const composeDraftLoad = () => ({
    type: COMPOSE_DRAFT_LOAD
});

export const COMPOSE_DRAFT_LOADED = "COMPOSE_DRAFT_LOADED";
export const composeDraftLoaded = (posting) => ({
    type: COMPOSE_DRAFT_LOADED,
    payload: {posting}
});

export const COMPOSE_DRAFT_LOAD_FAILED = "COMPOSE_DRAFT_LOAD_FAILED";
export const composeDraftLoadFailed = () => ({
    type: COMPOSE_DRAFT_LOAD_FAILED
});

export const COMPOSE_DRAFT_SAVE = "COMPOSE_DRAFT_SAVE";
export const composeDraftSave = (postingId, draftId, postingText) => ({
    type: COMPOSE_DRAFT_SAVE,
    payload: {postingId, draftId, postingText}
});

export const COMPOSE_DRAFT_SAVED = "COMPOSE_DRAFT_SAVED";
export const composeDraftSaved = (postingId, draftId) => ({
    type: COMPOSE_DRAFT_SAVED,
    payload: {postingId, draftId}
});

export const COMPOSE_DRAFT_SAVE_FAILED = "COMPOSE_DRAFT_SAVE_FAILED";
export const composeDraftSaveFailed = () => ({
    type: COMPOSE_DRAFT_SAVE_FAILED
});

export const COMPOSE_DRAFT_LIST_LOAD = "COMPOSE_DRAFT_LIST_LOAD";
export const composeDraftListLoad = () => ({
    type: COMPOSE_DRAFT_LIST_LOAD
});

export const COMPOSE_DRAFT_LIST_LOADED = "COMPOSE_DRAFT_LIST_LOADED";
export const composeDraftListLoaded = (draftList) => ({
    type: COMPOSE_DRAFT_LIST_LOADED,
    payload: {draftList}
});

export const COMPOSE_DRAFT_LIST_LOAD_FAILED = "COMPOSE_DRAFT_LIST_LOAD_FAILED";
export const composeDraftListLoadFailed = () => ({
    type: COMPOSE_DRAFT_LIST_LOAD_FAILED
});

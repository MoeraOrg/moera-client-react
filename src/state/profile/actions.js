export const PROFILE_LOAD = "PROFILE_LOAD";
export const profileLoad = (withSource = false) => ({
    type: PROFILE_LOAD,
    payload: {withSource}
});

export const PROFILE_LOAD_FAILED = "PROFILE_LOAD_FAILED";
export const profileLoadFailed = () => ({
    type: PROFILE_LOAD_FAILED
});

export const PROFILE_SET = "PROFILE_SET";
export const profileSet = (profile) => ({
    type: PROFILE_SET,
    payload: {profile}
});

export const PROFILE_UNSET = "PROFILE_UNSET";
export const profileUnset = () => ({
    type: PROFILE_UNSET
});

export const PROFILE_EDIT = "PROFILE_EDIT";
export const profileEdit = () => ({
    type: PROFILE_EDIT
});

export const PROFILE_EDIT_CANCEL = "PROFILE_EDIT_CANCEL";
export const profileEditCancel = () => ({
    type: PROFILE_EDIT_CANCEL
});

export const PROFILE_EDIT_CONFLICT = "PROFILE_EDIT_CONFLICT";
export const profileEditConflict = () => ({
    type: PROFILE_EDIT_CONFLICT
});

export const PROFILE_EDIT_CONFLICT_CLOSE = "PROFILE_EDIT_CONFLICT_CLOSE";
export const profileEditConflictClose = () => ({
    type: PROFILE_EDIT_CONFLICT_CLOSE
});

export const PROFILE_UPDATE = "PROFILE_UPDATE";
export const profileUpdate = (profile) => ({
    type: PROFILE_UPDATE,
    payload: profile
});

export const PROFILE_UPDATE_SUCCEEDED = "PROFILE_UPDATE_SUCCEEDED";
export const profileUpdateSucceeded = () => ({
    type: PROFILE_UPDATE_SUCCEEDED
});

export const PROFILE_UPDATE_FAILED = "PROFILE_UPDATE_FAILED";
export const profileUpdateFailed = () => ({
    type: PROFILE_UPDATE_FAILED
});

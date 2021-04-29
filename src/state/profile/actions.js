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

export const PROFILE_AVATARS_LOAD = "PROFILE_AVATARS_LOAD";
export const profileAvatarsLoad = () => ({
    type: PROFILE_AVATARS_LOAD
});

export const PROFILE_AVATARS_LOADED = "PROFILE_AVATARS_LOADED";
export const profileAvatarsLoaded = (avatars) => ({
    type: PROFILE_AVATARS_LOADED,
    payload: {avatars}
});

export const PROFILE_AVATARS_LOAD_FAILED = "PROFILE_AVATARS_LOAD_FAILED";
export const profileAvatarsLoadFailed = () => ({
    type: PROFILE_AVATARS_LOAD_FAILED
});

export const PROFILE_OPEN_AVATAR_EDIT_DIALOG = "PROFILE_OPEN_AVATAR_EDIT_DIALOG";
export const profileOpenAvatarEditDialog = (onCreate) => ({
    type: PROFILE_OPEN_AVATAR_EDIT_DIALOG,
    payload: {onCreate}
});

export const PROFILE_CLOSE_AVATAR_EDIT_DIALOG = "PROFILE_CLOSE_AVATAR_EDIT_DIALOG";
export const profileCloseAvatarEditDialog = () => ({
    type: PROFILE_CLOSE_AVATAR_EDIT_DIALOG
});

export const PROFILE_IMAGE_UPLOAD = "PROFILE_IMAGE_UPLOAD";
export const profileImageUpload = (file) => ({
    type: PROFILE_IMAGE_UPLOAD,
    payload: {file}
});

export const PROFILE_IMAGE_UPLOADED = "PROFILE_IMAGE_UPLOADED";
export const profileImageUploaded = (id, path, width, height) => ({
    type: PROFILE_IMAGE_UPLOADED,
    payload: {id, path, width, height}
});

export const PROFILE_IMAGE_UPLOAD_FAILED = "PROFILE_IMAGE_UPLOAD_FAILED";
export const profileImageUploadFailed = () => ({
    type: PROFILE_IMAGE_UPLOAD_FAILED
});

export const PROFILE_AVATAR_CREATE = "PROFILE_AVATAR_CREATE";
export const profileAvatarCreate = (avatar) => ({
    type: PROFILE_AVATAR_CREATE,
    payload: {avatar}
});

export const PROFILE_AVATAR_CREATED = "PROFILE_AVATAR_CREATED";
export const profileAvatarCreated = (avatar) => ({
    type: PROFILE_AVATAR_CREATED,
    payload: {avatar}
});

export const PROFILE_AVATAR_CREATE_FAILED = "PROFILE_AVATAR_CREATE_FAILED";
export const profileAvatarCreateFailed = () => ({
    type: PROFILE_AVATAR_CREATE_FAILED
});

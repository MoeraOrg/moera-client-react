import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { AvatarAttributes, AvatarImage, AvatarInfo, ProfileAttributes, ProfileInfo } from "api/node/api-types";
import { AvatarOnCreate } from "state/profile/state";

export const PROFILE_LOAD = "PROFILE_LOAD";
export type ProfileLoadAction = Action<typeof PROFILE_LOAD>;
export const profileLoad = (): ProfileLoadAction => ({
    type: PROFILE_LOAD
});

export const PROFILE_LOAD_FAILED = "PROFILE_LOAD_FAILED";
export type ProfileLoadFailedAction = Action<typeof PROFILE_LOAD_FAILED>;
export const profileLoadFailed = (): ProfileLoadFailedAction => ({
    type: PROFILE_LOAD_FAILED
});

export const PROFILE_SET = "PROFILE_SET";
export type ProfileSetAction = ActionWithPayload<typeof PROFILE_SET, {
    profile: ProfileInfo;
}>;
export const profileSet = (profile: ProfileInfo): ProfileSetAction => ({
    type: PROFILE_SET,
    payload: {profile}
});

export const PROFILE_UNSET = "PROFILE_UNSET";
export type ProfileUnsetAction = Action<typeof PROFILE_UNSET>;
export const profileUnset = (): ProfileUnsetAction => ({
    type: PROFILE_UNSET
});

export const PROFILE_EDIT = "PROFILE_EDIT";
export type ProfileEditAction = Action<typeof PROFILE_EDIT>;
export const profileEdit = (): ProfileEditAction => ({
    type: PROFILE_EDIT
});

export const PROFILE_EDIT_CANCEL = "PROFILE_EDIT_CANCEL";
export type ProfileEditCancelAction = Action<typeof PROFILE_EDIT_CANCEL>;
export const profileEditCancel = (): ProfileEditCancelAction => ({
    type: PROFILE_EDIT_CANCEL
});

export const PROFILE_EDIT_CONFLICT = "PROFILE_EDIT_CONFLICT";
export type ProfileEditConflictAction = Action<typeof PROFILE_EDIT_CONFLICT>;
export const profileEditConflict = (): ProfileEditConflictAction => ({
    type: PROFILE_EDIT_CONFLICT
});

export const PROFILE_EDIT_CONFLICT_CLOSE = "PROFILE_EDIT_CONFLICT_CLOSE";
export type ProfileEditConflictCloseAction = Action<typeof PROFILE_EDIT_CONFLICT_CLOSE>;
export const profileEditConflictClose = (): ProfileEditConflictCloseAction => ({
    type: PROFILE_EDIT_CONFLICT_CLOSE
});

export const PROFILE_UPDATE = "PROFILE_UPDATE";
export type ProfileUpdateAction = ActionWithPayload<typeof PROFILE_UPDATE, {
    profile: ProfileAttributes;
}>;
export const profileUpdate = (profile: ProfileAttributes): ProfileUpdateAction => ({
    type: PROFILE_UPDATE,
    payload: {profile}
});

export const PROFILE_UPDATE_SUCCEEDED = "PROFILE_UPDATE_SUCCEEDED";
export type ProfileUpdateSucceededAction = Action<typeof PROFILE_UPDATE_SUCCEEDED>;
export const profileUpdateSucceeded = (): ProfileUpdateSucceededAction => ({
    type: PROFILE_UPDATE_SUCCEEDED
});

export const PROFILE_UPDATE_FAILED = "PROFILE_UPDATE_FAILED";
export type ProfileUpdateFailedAction = Action<typeof PROFILE_UPDATE_FAILED>;
export const profileUpdateFailed = (): ProfileUpdateFailedAction => ({
    type: PROFILE_UPDATE_FAILED
});

export const PROFILE_AVATARS_LOAD = "PROFILE_AVATARS_LOAD";
export type ProfileAvatarsLoadAction = Action<typeof PROFILE_AVATARS_LOAD>;
export const profileAvatarsLoad = (): ProfileAvatarsLoadAction => ({
    type: PROFILE_AVATARS_LOAD
});

export const PROFILE_AVATARS_LOADED = "PROFILE_AVATARS_LOADED";
export type ProfileAvatarsLoadedAction = ActionWithPayload<typeof PROFILE_AVATARS_LOADED, {
    avatars: AvatarImage[];
}>;
export const profileAvatarsLoaded = (avatars: AvatarImage[]): ProfileAvatarsLoadedAction => ({
    type: PROFILE_AVATARS_LOADED,
    payload: {avatars}
});

export const PROFILE_AVATARS_LOAD_FAILED = "PROFILE_AVATARS_LOAD_FAILED";
export type ProfileAvatarsLoadFailedAction = Action<typeof PROFILE_AVATARS_LOAD_FAILED>;
export const profileAvatarsLoadFailed = (): ProfileAvatarsLoadFailedAction => ({
    type: PROFILE_AVATARS_LOAD_FAILED
});

export const PROFILE_OPEN_AVATAR_EDIT_DIALOG = "PROFILE_OPEN_AVATAR_EDIT_DIALOG";
export type ProfileOpenAvatarEditDialogAction = ActionWithPayload<typeof PROFILE_OPEN_AVATAR_EDIT_DIALOG, {
    onCreate: AvatarOnCreate;
}>;
export const profileOpenAvatarEditDialog = (onCreate: AvatarOnCreate): ProfileOpenAvatarEditDialogAction => ({
    type: PROFILE_OPEN_AVATAR_EDIT_DIALOG,
    payload: {onCreate}
});

export const PROFILE_CLOSE_AVATAR_EDIT_DIALOG = "PROFILE_CLOSE_AVATAR_EDIT_DIALOG";
export type ProfileCloseAvatarEditDialogAction = Action<typeof PROFILE_CLOSE_AVATAR_EDIT_DIALOG>;
export const profileCloseAvatarEditDialog = (): ProfileCloseAvatarEditDialogAction => ({
    type: PROFILE_CLOSE_AVATAR_EDIT_DIALOG
});

export const PROFILE_IMAGE_UPLOAD = "PROFILE_IMAGE_UPLOAD";
export type ProfileImageUploadAction = ActionWithPayload<typeof PROFILE_IMAGE_UPLOAD, {
    file: File;
}>;
export const profileImageUpload = (file: File): ProfileImageUploadAction => ({
    type: PROFILE_IMAGE_UPLOAD,
    payload: {file}
});

export const PROFILE_IMAGE_UPLOAD_PROGRESS = "PROFILE_IMAGE_UPLOAD_PROGRESS";
export type ProfileImageUploadProgressAction = ActionWithPayload<typeof PROFILE_IMAGE_UPLOAD_PROGRESS, {
    loaded: number;
    total: number;
}>;
export const profileImageUploadProgress = (loaded: number, total: number): ProfileImageUploadProgressAction => ({
    type: PROFILE_IMAGE_UPLOAD_PROGRESS,
    payload: {loaded, total}
});

export const PROFILE_IMAGE_UPLOADED = "PROFILE_IMAGE_UPLOADED";
export type ProfileImageUploadedAction = ActionWithPayload<typeof PROFILE_IMAGE_UPLOADED, {
    id: string;
    path: string;
    width: number;
    height: number;
    orientation: number;
}>;
export const profileImageUploaded = (id: string, path: string,
                                     width: number, height: number,
                                     orientation: number): ProfileImageUploadedAction => ({
    type: PROFILE_IMAGE_UPLOADED,
    payload: {id, path, width, height, orientation}
});

export const PROFILE_IMAGE_UPLOAD_FAILED = "PROFILE_IMAGE_UPLOAD_FAILED";
export type ProfileImageUploadFailedAction = Action<typeof PROFILE_IMAGE_UPLOAD_FAILED>;
export const profileImageUploadFailed = (): ProfileImageUploadFailedAction => ({
    type: PROFILE_IMAGE_UPLOAD_FAILED
});

export const PROFILE_AVATAR_CREATE = "PROFILE_AVATAR_CREATE";
export type ProfileAvatarCreateAction = ActionWithPayload<typeof PROFILE_AVATAR_CREATE, {
    avatar: AvatarAttributes;
}>;
export const profileAvatarCreate = (avatar: AvatarAttributes): ProfileAvatarCreateAction => ({
    type: PROFILE_AVATAR_CREATE,
    payload: {avatar}
});

export const PROFILE_AVATAR_CREATED = "PROFILE_AVATAR_CREATED";
export type ProfileAvatarCreatedAction = ActionWithPayload<typeof PROFILE_AVATAR_CREATED, {
    avatar: AvatarInfo;
}>;
export const profileAvatarCreated = (avatar: AvatarInfo): ProfileAvatarCreatedAction => ({
    type: PROFILE_AVATAR_CREATED,
    payload: {avatar}
});

export const PROFILE_AVATAR_CREATE_FAILED = "PROFILE_AVATAR_CREATE_FAILED";
export type ProfileAvatarCreateFailedAction = Action<typeof PROFILE_AVATAR_CREATE_FAILED>;
export const profileAvatarCreateFailed = (): ProfileAvatarCreateFailedAction => ({
    type: PROFILE_AVATAR_CREATE_FAILED
});

export const PROFILE_AVATAR_CONFIRM_DELETE = "PROFILE_AVATAR_CONFIRM_DELETE";
export type ProfileAvatarConfirmDeleteAction = ActionWithPayload<typeof PROFILE_AVATAR_CONFIRM_DELETE, {
    id: string;
    onDeleted: any;
}>;
export const profileAvatarConfirmDelete = (id: string, onDeleted: any): ProfileAvatarConfirmDeleteAction => ({
    type: PROFILE_AVATAR_CONFIRM_DELETE,
    payload: {id, onDeleted}
});

export const PROFILE_AVATAR_DELETE = "PROFILE_AVATAR_DELETE";
export type ProfileAvatarDeleteAction = ActionWithPayload<typeof PROFILE_AVATAR_DELETE, {
    id: string;
    onDeleted: any;
}>;
export const profileAvatarDelete = (id: string, onDeleted: any): ProfileAvatarDeleteAction => ({
    type: PROFILE_AVATAR_DELETE,
    payload: {id, onDeleted}
});

export const PROFILE_AVATAR_DELETED = "PROFILE_AVATAR_DELETED";
export type ProfileAvatarDeletedAction = ActionWithPayload<typeof PROFILE_AVATAR_DELETED, {
    id: string;
}>;
export const profileAvatarDeleted = (id: string): ProfileAvatarDeletedAction => ({
    type: PROFILE_AVATAR_DELETED,
    payload: {id}
});

export const PROFILE_AVATARS_REORDER = "PROFILE_AVATARS_REORDER";
export type ProfileAvatarsReorderAction = ActionWithPayload<typeof PROFILE_AVATARS_REORDER, {
    avatarId: string;
    overAvatarId: string;
}>;
export const profileAvatarsReorder = (avatarId: string, overAvatarId: string): ProfileAvatarsReorderAction => ({
    type: PROFILE_AVATARS_REORDER,
    payload: {avatarId, overAvatarId}
});

export type ProfileAnyAction =
    ProfileLoadAction
    | ProfileLoadFailedAction
    | ProfileSetAction
    | ProfileUnsetAction
    | ProfileEditAction
    | ProfileEditCancelAction
    | ProfileEditConflictAction
    | ProfileEditConflictCloseAction
    | ProfileUpdateAction
    | ProfileUpdateSucceededAction
    | ProfileUpdateFailedAction
    | ProfileAvatarsLoadAction
    | ProfileAvatarsLoadedAction
    | ProfileAvatarsLoadFailedAction
    | ProfileOpenAvatarEditDialogAction
    | ProfileCloseAvatarEditDialogAction
    | ProfileImageUploadAction
    | ProfileImageUploadProgressAction
    | ProfileImageUploadedAction
    | ProfileImageUploadFailedAction
    | ProfileAvatarCreateAction
    | ProfileAvatarCreatedAction
    | ProfileAvatarCreateFailedAction
    | ProfileAvatarConfirmDeleteAction
    | ProfileAvatarDeleteAction
    | ProfileAvatarDeletedAction
    | ProfileAvatarsReorderAction;

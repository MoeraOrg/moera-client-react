import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { AvatarAttributes, AvatarImage, AvatarInfo, ProfileAttributes, ProfileInfo } from "api";
import { AvatarOnCreate } from "state/profile/state";

export type ProfileLoadAction = ActionWithoutPayload<"PROFILE_LOAD">;
export const profileLoad = (): ProfileLoadAction =>
    actionWithoutPayload("PROFILE_LOAD");

export type ProfileLoadFailedAction = ActionWithoutPayload<"PROFILE_LOAD_FAILED">;
export const profileLoadFailed = (): ProfileLoadFailedAction =>
    actionWithoutPayload("PROFILE_LOAD_FAILED");

export type ProfileSetAction = ActionWithPayload<"PROFILE_SET", {
    profile: ProfileInfo;
}>;
export const profileSet = (profile: ProfileInfo): ProfileSetAction =>
    actionWithPayload("PROFILE_SET", {profile});

export type ProfileUnsetAction = ActionWithoutPayload<"PROFILE_UNSET">;
export const profileUnset = (): ProfileUnsetAction =>
    actionWithoutPayload("PROFILE_UNSET");

export type ProfileEditAction = ActionWithoutPayload<"PROFILE_EDIT">;
export const profileEdit = (): ProfileEditAction =>
    actionWithoutPayload("PROFILE_EDIT");

export type ProfileEditCancelAction = ActionWithoutPayload<"PROFILE_EDIT_CANCEL">;
export const profileEditCancel = (): ProfileEditCancelAction =>
    actionWithoutPayload("PROFILE_EDIT_CANCEL");

export type ProfileEditConflictAction = ActionWithoutPayload<"PROFILE_EDIT_CONFLICT">;
export const profileEditConflict = (): ProfileEditConflictAction =>
    actionWithoutPayload("PROFILE_EDIT_CONFLICT");

export type ProfileEditConflictCloseAction = ActionWithoutPayload<"PROFILE_EDIT_CONFLICT_CLOSE">;
export const profileEditConflictClose = (): ProfileEditConflictCloseAction =>
    actionWithoutPayload("PROFILE_EDIT_CONFLICT_CLOSE");

export type ProfileUpdateAction = ActionWithPayload<"PROFILE_UPDATE", {
    profile: ProfileAttributes;
}>;
export const profileUpdate = (profile: ProfileAttributes): ProfileUpdateAction =>
    actionWithPayload("PROFILE_UPDATE", {profile});

export type ProfileUpdateSucceededAction = ActionWithoutPayload<"PROFILE_UPDATE_SUCCEEDED">;
export const profileUpdateSucceeded = (): ProfileUpdateSucceededAction =>
    actionWithoutPayload("PROFILE_UPDATE_SUCCEEDED");

export type ProfileUpdateFailedAction = ActionWithoutPayload<"PROFILE_UPDATE_FAILED">;
export const profileUpdateFailed = (): ProfileUpdateFailedAction =>
    actionWithoutPayload("PROFILE_UPDATE_FAILED");

export const PROFILE_AVATARS_LOAD = "PROFILE_AVATARS_LOAD";
export type ProfileAvatarsLoadAction = ActionWithoutPayload<typeof PROFILE_AVATARS_LOAD>;
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
export type ProfileAvatarsLoadFailedAction = ActionWithoutPayload<typeof PROFILE_AVATARS_LOAD_FAILED>;
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
export type ProfileCloseAvatarEditDialogAction = ActionWithoutPayload<typeof PROFILE_CLOSE_AVATAR_EDIT_DIALOG>;
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
export type ProfileImageUploadFailedAction = ActionWithoutPayload<typeof PROFILE_IMAGE_UPLOAD_FAILED>;
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
export type ProfileAvatarCreateFailedAction = ActionWithoutPayload<typeof PROFILE_AVATAR_CREATE_FAILED>;
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

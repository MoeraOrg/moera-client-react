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

export type ProfileAvatarsLoadAction = ActionWithoutPayload<"PROFILE_AVATARS_LOAD">;
export const profileAvatarsLoad = (): ProfileAvatarsLoadAction =>
    actionWithoutPayload("PROFILE_AVATARS_LOAD");

export type ProfileAvatarsLoadedAction = ActionWithPayload<"PROFILE_AVATARS_LOADED", {
    avatars: AvatarImage[];
}>;
export const profileAvatarsLoaded = (avatars: AvatarImage[]): ProfileAvatarsLoadedAction =>
    actionWithPayload("PROFILE_AVATARS_LOADED", {avatars});

export type ProfileAvatarsLoadFailedAction = ActionWithoutPayload<"PROFILE_AVATARS_LOAD_FAILED">;
export const profileAvatarsLoadFailed = (): ProfileAvatarsLoadFailedAction =>
    actionWithoutPayload("PROFILE_AVATARS_LOAD_FAILED");

export type ProfileOpenAvatarEditDialogAction = ActionWithPayload<"PROFILE_OPEN_AVATAR_EDIT_DIALOG", {
    onCreate: AvatarOnCreate;
}>;
export const profileOpenAvatarEditDialog = (onCreate: AvatarOnCreate): ProfileOpenAvatarEditDialogAction =>
    actionWithPayload("PROFILE_OPEN_AVATAR_EDIT_DIALOG", {onCreate});

export type ProfileCloseAvatarEditDialogAction = ActionWithoutPayload<"PROFILE_CLOSE_AVATAR_EDIT_DIALOG">;
export const profileCloseAvatarEditDialog = (): ProfileCloseAvatarEditDialogAction =>
    actionWithoutPayload("PROFILE_CLOSE_AVATAR_EDIT_DIALOG");

export type ProfileImageUploadAction = ActionWithPayload<"PROFILE_IMAGE_UPLOAD", {
    file: File;
}>;
export const profileImageUpload = (file: File): ProfileImageUploadAction =>
    actionWithPayload("PROFILE_IMAGE_UPLOAD", {file});

export type ProfileImageUploadProgressAction = ActionWithPayload<"PROFILE_IMAGE_UPLOAD_PROGRESS", {
    loaded: number;
    total: number;
}>;
export const profileImageUploadProgress = (loaded: number, total: number): ProfileImageUploadProgressAction =>
    actionWithPayload("PROFILE_IMAGE_UPLOAD_PROGRESS", {loaded, total});

export type ProfileImageUploadedAction = ActionWithPayload<"PROFILE_IMAGE_UPLOADED", {
    id: string;
    path: string;
    width: number;
    height: number;
    orientation: number;
}>;
export const profileImageUploaded = (
    id: string, path: string, width: number, height: number, orientation: number
): ProfileImageUploadedAction =>
    actionWithPayload("PROFILE_IMAGE_UPLOADED", {id, path, width, height, orientation});

export type ProfileImageUploadFailedAction = ActionWithoutPayload<"PROFILE_IMAGE_UPLOAD_FAILED">;
export const profileImageUploadFailed = (): ProfileImageUploadFailedAction =>
    actionWithoutPayload("PROFILE_IMAGE_UPLOAD_FAILED");

export type ProfileAvatarCreateAction = ActionWithPayload<"PROFILE_AVATAR_CREATE", {
    avatar: AvatarAttributes;
}>;
export const profileAvatarCreate = (avatar: AvatarAttributes): ProfileAvatarCreateAction =>
    actionWithPayload("PROFILE_AVATAR_CREATE", {avatar});

export type ProfileAvatarCreatedAction = ActionWithPayload<"PROFILE_AVATAR_CREATED", {
    avatar: AvatarInfo;
}>;
export const profileAvatarCreated = (avatar: AvatarInfo): ProfileAvatarCreatedAction =>
    actionWithPayload("PROFILE_AVATAR_CREATED", {avatar});

export type ProfileAvatarCreateFailedAction = ActionWithoutPayload<"PROFILE_AVATAR_CREATE_FAILED">;
export const profileAvatarCreateFailed = (): ProfileAvatarCreateFailedAction =>
    actionWithoutPayload("PROFILE_AVATAR_CREATE_FAILED");

export type ProfileAvatarConfirmDeleteAction = ActionWithPayload<"PROFILE_AVATAR_CONFIRM_DELETE", {
    id: string;
    onDeleted: any;
}>;
export const profileAvatarConfirmDelete = (id: string, onDeleted: any): ProfileAvatarConfirmDeleteAction =>
    actionWithPayload("PROFILE_AVATAR_CONFIRM_DELETE", {id, onDeleted});

export type ProfileAvatarDeleteAction = ActionWithPayload<"PROFILE_AVATAR_DELETE", {
    id: string;
    onDeleted: any;
}>;
export const profileAvatarDelete = (id: string, onDeleted: any): ProfileAvatarDeleteAction =>
    actionWithPayload("PROFILE_AVATAR_DELETE", {id, onDeleted});

export type ProfileAvatarDeletedAction = ActionWithPayload<"PROFILE_AVATAR_DELETED", {
    id: string;
}>;
export const profileAvatarDeleted = (id: string): ProfileAvatarDeletedAction =>
    actionWithPayload("PROFILE_AVATAR_DELETED", {id});

export type ProfileAvatarsReorderAction = ActionWithPayload<"PROFILE_AVATARS_REORDER", {
    avatarId: string;
    overAvatarId: string;
}>;
export const profileAvatarsReorder = (avatarId: string, overAvatarId: string): ProfileAvatarsReorderAction =>
    actionWithPayload("PROFILE_AVATARS_REORDER", {avatarId, overAvatarId});

export type ProfileAnyAction =
    ProfileLoadAction
    | ProfileLoadFailedAction
    | ProfileSetAction
    | ProfileUnsetAction
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

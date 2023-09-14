import { AvatarInfo, ProfileInfo } from "api";

export type AvatarOnCreate = (avatar: AvatarInfo) => void;

export interface AvatarEditDialogState {
    show: boolean;
    imageUploading: boolean;
    imageUploadProgress: number | null;
    imageId: string | null;
    path: string | null;
    width: number | null;
    height: number | null;
    orientation: number | null;
    avatarCreating: boolean;
    onCreate: AvatarOnCreate | null;
}

export interface ProfileState {
    loaded: boolean;
    loading: boolean;
    profile: ProfileInfo;
    avatars: {
        loading: boolean;
        loaded: boolean;
        avatars: AvatarInfo[];
    };
    editing: boolean;
    avatarEditDialog: AvatarEditDialogState;
    conflict: boolean;
    updating: boolean;
}

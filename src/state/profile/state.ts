import { AvatarInfo } from "api/node/api-types";

export type AvatarOnCreate = (avatar: AvatarInfo) => void;

export interface AvatarEditDialogState {
    show: boolean;
    imageUploading: boolean;
    imageId: string | null;
    path: string | null;
    width: number | null;
    height: number | null;
    avatarCreating: boolean;
    onCreate: AvatarOnCreate | null;
}

export interface ProfileInfoState {
    nodeName: string | null;
    fullName: string | null;
    gender: string | null;
    email: string | null;
    title: string | null;
    bioSrc: string | null;
    bioHtml: string | null;
    avatar: AvatarInfo | null;
    operations: {
        edit: string[];
    };
}

export interface ProfileState extends ProfileInfoState {
    loaded: boolean;
    loading: boolean;
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

import * as immutable from 'object-path-immutable';

import {
    PROFILE_AVATAR_CREATE,
    PROFILE_AVATAR_CREATE_FAILED,
    PROFILE_AVATAR_CREATED,
    PROFILE_CLOSE_AVATAR_EDIT_DIALOG,
    PROFILE_EDIT,
    PROFILE_EDIT_CANCEL,
    PROFILE_EDIT_CONFLICT,
    PROFILE_EDIT_CONFLICT_CLOSE,
    PROFILE_IMAGE_UPLOAD,
    PROFILE_IMAGE_UPLOAD_FAILED,
    PROFILE_IMAGE_UPLOADED,
    PROFILE_LOAD,
    PROFILE_LOAD_FAILED,
    PROFILE_OPEN_AVATAR_EDIT_DIALOG,
    PROFILE_SET,
    PROFILE_UNSET,
    PROFILE_UPDATE,
    PROFILE_UPDATE_FAILED,
    PROFILE_UPDATE_SUCCEEDED
} from "state/profile/actions";

const emptyProfile = {
    nodeName: null,
    fullName: null,
    gender: null,
    email: null,
    title: null,
    bioSrc: null,
    bioHtml: null,
    avatar: null,
    operations: {
        edit: []
    }
};

const emptyAvatarEditDialog = {
    show: false,
    imageUploading: false,
    imageId: null,
    path: null,
    width: null,
    height: null,
    avatarCreating: false
};

const initialState = {
    loaded: false,
    loading: false,
    ...emptyProfile,
    editing: false,
    avatarEditDialog: {
        ...emptyAvatarEditDialog
    },
    conflict: false,
    updating: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_LOAD:
            return {
                ...state,
                loading: true
            };

        case PROFILE_LOAD_FAILED:
            return {
                ...state,
                loading: false
            };

        case PROFILE_SET:
            return {
                ...state,
                ...emptyProfile,
                ...action.payload.profile,
                loading: false,
                loaded: true
            };

        case PROFILE_UNSET:
            return {
                ...state,
                ...emptyProfile,
                loading: false,
                loaded: false
            };

        case PROFILE_EDIT:
            return {
                ...state,
                editing: true,
                conflict: false
            };

        case PROFILE_EDIT_CONFLICT:
            return {
                ...state,
                conflict: true
            };

        case PROFILE_EDIT_CONFLICT_CLOSE:
            return {
                ...state,
                conflict: false
            };

        case PROFILE_UPDATE:
            return {
                ...state,
                updating: true
            };

        case PROFILE_EDIT_CANCEL:
        case PROFILE_UPDATE_SUCCEEDED:
            return {
                ...state,
                editing: false,
                conflict: false,
                updating: false
            };

        case PROFILE_UPDATE_FAILED:
            return {
                ...state,
                updating: false
            };

        case PROFILE_OPEN_AVATAR_EDIT_DIALOG:
            return immutable.wrap(state)
                .assign("avatarEditDialog", emptyAvatarEditDialog)
                .set("avatarEditDialog.show", true)
                .value();

        case PROFILE_CLOSE_AVATAR_EDIT_DIALOG:
            return immutable.set(state, "avatarEditDialog.show", false);

        case PROFILE_IMAGE_UPLOAD:
            return immutable.set(state, "avatarEditDialog.imageUploading", true);

        case PROFILE_IMAGE_UPLOADED:
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: false,
                imageId: action.payload.id,
                path: action.payload.path,
                width: action.payload.width,
                height: action.payload.height
            })

        case PROFILE_IMAGE_UPLOAD_FAILED:
            return immutable.set(state, "avatarEditDialog.imageUploading", false);

        case PROFILE_AVATAR_CREATE:
            return immutable.set(state, "avatarEditDialog.avatarCreating", true);

        case PROFILE_AVATAR_CREATED:
            return immutable.assign(state, "avatarEditDialog", {
                show: false,
                avatarCreating: false
            });

        case PROFILE_AVATAR_CREATE_FAILED:
            return immutable.set(state, "avatarEditDialog.avatarCreating", false);

        default:
            return state;
    }
}

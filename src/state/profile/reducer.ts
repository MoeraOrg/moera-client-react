import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';
import { arrayMove } from '@dnd-kit/sortable';

import { EVENT_NODE_AVATAR_ADDED, EVENT_NODE_AVATAR_DELETED, EVENT_NODE_AVATAR_ORDERED } from 'api/events/actions';
import { AvatarInfo } from "api/node/api-types";
import {
    PROFILE_AVATAR_CREATE,
    PROFILE_AVATAR_CREATE_FAILED,
    PROFILE_AVATAR_CREATED,
    PROFILE_AVATAR_DELETED,
    PROFILE_AVATARS_LOAD,
    PROFILE_AVATARS_LOAD_FAILED,
    PROFILE_AVATARS_LOADED,
    PROFILE_AVATARS_REORDER,
    PROFILE_CLOSE_AVATAR_EDIT_DIALOG,
    PROFILE_EDIT,
    PROFILE_EDIT_CANCEL,
    PROFILE_EDIT_CONFLICT,
    PROFILE_EDIT_CONFLICT_CLOSE,
    PROFILE_IMAGE_UPLOAD,
    PROFILE_IMAGE_UPLOAD_FAILED,
    PROFILE_IMAGE_UPLOAD_PROGRESS,
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
import { ProfileState } from "state/profile/state";
import { ClientAction } from "state/action";
import { cloneOperations } from "util/misc";

const emptyProfileInfo = {
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

const emptyProfile = {
    loaded: false,
    loading: false,
    nodeName: null,
    profile: cloneDeep(emptyProfileInfo),
    avatars: {
        loading: false,
        loaded: false,
        avatars: []
    }
}

const emptyAvatarEditDialog = {
    show: false,
    imageUploading: false,
    imageUploadProgress: null,
    imageId: null,
    path: null,
    width: null,
    height: null,
    avatarCreating: false,
    onCreate: null
};

const initialState = {
    ...cloneDeep(emptyProfile),
    editing: false,
    avatarEditDialog: {
        ...emptyAvatarEditDialog
    },
    conflict: false,
    updating: false
};

export default (state: ProfileState = initialState, action: ClientAction): ProfileState => {
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
                profile: {
                    ...cloneDeep(emptyProfileInfo),
                    fullName: action.payload.profile.fullName ?? null,
                    gender: action.payload.profile.gender ?? null,
                    email: action.payload.profile.email ?? null,
                    title: action.payload.profile.title ?? null,
                    bioSrc: action.payload.profile.bioSrc ?? null,
                    bioHtml: action.payload.profile.bioHtml ?? null,
                    avatar: cloneDeep(action.payload.profile.avatar) ?? null,
                    operations: cloneOperations(action.payload.profile.operations, emptyProfileInfo.operations),
                },
                loading: false,
                loaded: true
            };

        case PROFILE_UNSET:
            return {
                ...state,
                ...cloneDeep(emptyProfile)
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

        case PROFILE_AVATARS_LOAD:
            return immutable.set(state, "avatars.loading", true);

        case PROFILE_AVATARS_LOADED:
            return immutable.assign(state, "avatars", {
                loading: false,
                loaded: true,
                avatars: action.payload.avatars
            });

        case PROFILE_AVATARS_LOAD_FAILED:
            return immutable.set(state, "avatars.loading", false);

        case PROFILE_OPEN_AVATAR_EDIT_DIALOG:
            return immutable.wrap(state)
                .assign("avatarEditDialog", {
                    ...emptyAvatarEditDialog,
                    show: true,
                    onCreate: action.payload.onCreate
                })
                .value();

        case PROFILE_CLOSE_AVATAR_EDIT_DIALOG:
            return immutable.set(state, "avatarEditDialog.show", false);

        case PROFILE_IMAGE_UPLOAD:
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: true,
                imageUploadProgress: null
            });

        case PROFILE_IMAGE_UPLOAD_PROGRESS:
            return immutable.set(state, "avatarEditDialog.imageUploadProgress",
                Math.round(action.payload.loaded * 100 / action.payload.total));

        case PROFILE_IMAGE_UPLOADED:
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: false,
                imageUploadProgress: null,
                imageId: action.payload.id,
                path: action.payload.path,
                width: action.payload.width,
                height: action.payload.height
            })

        case PROFILE_IMAGE_UPLOAD_FAILED:
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: false,
                imageUploadProgress: null
            });

        case PROFILE_AVATAR_CREATE:
            return immutable.set(state, "avatarEditDialog.avatarCreating", true);

        case PROFILE_AVATAR_CREATED: {
            const istate = immutable.wrap(state);
            istate.assign("avatarEditDialog", {
                show: false,
                avatarCreating: false
            });
            if (state.avatars.loaded) {
                istate.insert("avatars.avatars", action.payload.avatar, 0);
            }
            return istate.value();
        }

        case PROFILE_AVATAR_CREATE_FAILED:
            return immutable.set(state, "avatarEditDialog.avatarCreating", false);

        case PROFILE_AVATAR_DELETED:
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.id);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case PROFILE_AVATARS_REORDER: {
            const {avatarId, overAvatarId} = action.payload;
            if (state.avatars.loaded && avatarId !== overAvatarId) {
                const index = state.avatars.avatars.findIndex(av => av.id === avatarId);
                const overIndex = state.avatars.avatars.findIndex(av => av.id === overAvatarId);
                if (index == null || overIndex == null) {
                    return state;
                }
                return immutable.set(state, "avatars.avatars", arrayMove(state.avatars.avatars, index, overIndex));
            }
            return state;
        }

        case EVENT_NODE_AVATAR_ADDED:
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.avatar.id);
                avatars.push(action.payload.avatar);
                avatars.sort((a, b) => b.ordinal - a.ordinal);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case EVENT_NODE_AVATAR_DELETED:
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.id);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case EVENT_NODE_AVATAR_ORDERED:
            if (state.avatars.loaded) {
                const avatars: AvatarInfo[] = [];
                state.avatars.avatars.forEach(av => {
                    if (av.id !== action.payload.id) {
                        avatars.push(av);
                    } else {
                        avatars.push({...av, ordinal: action.payload.ordinal});
                    }
                });
                avatars.sort((a, b) => b.ordinal - a.ordinal);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        default:
            return state;
    }
}

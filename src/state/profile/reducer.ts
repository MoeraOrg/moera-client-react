import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { AvatarInfo } from "api";
import { ProfileState } from "state/profile/state";
import { ClientAction } from "state/action";
import { arrayMove } from "util/misc";

const emptyProfileInfo = {
    fullName: null,
    gender: null,
    email: null,
    title: null,
    bioSrc: null,
    bioHtml: null,
    avatar: null,
    fundraisers: [],
    operations: null
};

const emptyProfile = {
    loaded: false,
    loading: false,
    profile: emptyProfileInfo,
    avatars: {
        loading: false,
        loaded: false,
        avatars: []
    },
    formId: 0
}

const emptyAvatarEditDialog = {
    show: false,
    imageUploading: false,
    imageUploadProgress: null,
    imageId: null,
    path: null,
    width: null,
    height: null,
    orientation: null,
    avatarCreating: false,
    onCreate: null
};

const initialState: ProfileState = {
    ...cloneDeep(emptyProfile),
    avatarEditDialog: {
        ...emptyAvatarEditDialog
    },
    conflict: false,
    updating: false
};

export default (state: ProfileState = initialState, action: ClientAction): ProfileState => {
    switch (action.type) {
        case "PROFILE_LOAD":
            return {
                ...state,
                loading: true
            };

        case "PROFILE_LOAD_FAILED":
            return {
                ...state,
                loading: false
            };

        case "PROFILE_SET":
            return {
                ...state,
                profile: {
                    ...cloneDeep(emptyProfileInfo),
                    ...cloneDeep(action.payload.profile)
                },
                loading: false,
                loaded: true,
                formId: state.formId + 1
            };

        case "PROFILE_UNSET":
            return {
                ...state,
                ...cloneDeep(emptyProfile),
                formId: state.formId + 1
            };

        case "PROFILE_EDIT_CONFLICT":
            return {
                ...state,
                conflict: true
            };

        case "PROFILE_EDIT_CONFLICT_CLOSE":
            return {
                ...state,
                conflict: false
            };

        case "PROFILE_UPDATE":
            return {
                ...state,
                updating: true
            };

        case "PROFILE_UPDATE_SUCCEEDED":
            return {
                ...state,
                conflict: false,
                updating: false
            };

        case "PROFILE_UPDATE_FAILED":
            return {
                ...state,
                updating: false
            };

        case "PROFILE_AVATARS_LOAD":
            return immutable.set(state, "avatars.loading", true);

        case "PROFILE_AVATARS_LOADED":
            return immutable.assign(state, "avatars", {
                loading: false,
                loaded: true,
                avatars: action.payload.avatars
            });

        case "PROFILE_AVATARS_LOAD_FAILED":
            return immutable.set(state, "avatars.loading", false);

        case "PROFILE_OPEN_AVATAR_EDIT_DIALOG":
            return immutable.wrap(state)
                .assign("avatarEditDialog", {
                    ...emptyAvatarEditDialog,
                    show: true,
                    onCreate: action.payload.onCreate
                })
                .value();

        case "PROFILE_CLOSE_AVATAR_EDIT_DIALOG":
            return immutable.set(state, "avatarEditDialog.show", false);

        case "PROFILE_IMAGE_UPLOAD":
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: true,
                imageUploadProgress: null
            });

        case "PROFILE_IMAGE_UPLOAD_PROGRESS":
            return immutable.set(state, "avatarEditDialog.imageUploadProgress",
                Math.round(action.payload.loaded * 100 / action.payload.total));

        case "PROFILE_IMAGE_UPLOADED":
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: false,
                imageUploadProgress: null,
                imageId: action.payload.id,
                path: action.payload.path,
                width: action.payload.width,
                height: action.payload.height,
                orientation: action.payload.orientation
            })

        case "PROFILE_IMAGE_UPLOAD_FAILED":
            return immutable.assign(state, "avatarEditDialog", {
                imageUploading: false,
                imageUploadProgress: null
            });

        case "PROFILE_AVATAR_CREATE":
            return immutable.set(state, "avatarEditDialog.avatarCreating", true);

        case "PROFILE_AVATAR_CREATED": {
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

        case "PROFILE_AVATAR_CREATE_FAILED":
            return immutable.set(state, "avatarEditDialog.avatarCreating", false);

        case "PROFILE_AVATAR_DELETED":
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.id);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case "PROFILE_AVATARS_REORDER": {
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

        case "EVENT_NODE_AVATAR_ADDED":
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.avatar.id);
                avatars.push(action.payload.avatar);
                avatars.sort((a, b) => b.ordinal - a.ordinal);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case "EVENT_NODE_AVATAR_DELETED":
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.id);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case "EVENT_NODE_AVATAR_ORDERED":
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

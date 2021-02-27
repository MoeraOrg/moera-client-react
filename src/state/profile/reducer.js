import {
    PROFILE_EDIT,
    PROFILE_EDIT_CANCEL,
    PROFILE_EDIT_CONFLICT,
    PROFILE_EDIT_CONFLICT_CLOSE,
    PROFILE_LOAD,
    PROFILE_LOAD_FAILED,
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
    operations: {
        edit: []
    }
};

const initialState = {
    loaded: false,
    loading: false,
    ...emptyProfile,
    editing: false,
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

        default:
            return state;
    }
}

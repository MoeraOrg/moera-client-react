import { call, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { CLIENT_SETTINGS_PREFIX, Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    ProfileAvatarCreateAction,
    profileAvatarCreated,
    profileAvatarCreateFailed,
    ProfileAvatarDeleteAction,
    profileAvatarDeleted,
    profileAvatarsLoaded,
    profileAvatarsLoadFailed,
    ProfileImageUploadAction,
    profileImageUploaded,
    profileImageUploadFailed,
    profileImageUploadProgress,
    profileLoadFailed,
    profileSet,
    ProfileUpdateAction,
    profileUpdateFailed,
    profileUpdateSucceeded
} from "state/profile/actions";
import { executor } from "state/executor";
import { messageBox } from "state/messagebox/actions";
import { getAvatars } from "state/profile/selectors";
import { settingsUpdate } from "state/settings/actions";
import store from "state/store";
import { introduced } from "state/init-selectors";

export default [
    executor("PROFILE_LOAD", "", profileLoadSaga, introduced),
    executor("PROFILE_UPDATE", null, profileUpdateSaga),
    executor("PROFILE_IMAGE_UPLOAD", null, profileImageUploadSaga),
    executor("PROFILE_AVATARS_LOAD", "", profileAvatarsLoadSaga),
    executor("PROFILE_AVATAR_CREATE", "", profileAvatarCreateSaga),
    executor("PROFILE_AVATAR_DELETE", payload => payload.id, profileAvatarDeleteSaga),
    executor("PROFILE_AVATARS_REORDER", "", profileAvatarsReorderSaga)
];

function* profileLoadSaga() {
    try {
        const profile = yield* call(Node.getProfile, "", true);
        yield* put(profileSet(profile));
    } catch (e) {
        yield* put(profileLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* profileUpdateSaga(action: ProfileUpdateAction) {
    try {
        const profile = yield* call(Node.updateProfile, "", action.payload.profile);
        yield* put(profileUpdateSucceeded());
        yield* put(profileSet(profile));
    } catch (e) {
        yield* put(profileUpdateFailed());
        yield* put(errorThrown(e));
    }
}

function* profileImageUploadSaga(action: ProfileImageUploadAction) {
    try {
        const {id, path, width, height, orientation} = yield* call(Node.uploadPublicMedia, "", action.payload.file,
            (loaded: number, total: number) => store.dispatch(profileImageUploadProgress(loaded, total)));
        if (width < 100 || height < 100) {
            yield* put(messageBox(i18n.t("avatar-too-small")));
            yield* put(profileImageUploadFailed());
        } else {
            yield* put(profileImageUploaded(id, path, width, height, orientation));
        }
    } catch (e) {
        yield* put(profileImageUploadFailed());
        yield* put(errorThrown(e));
    }
}

function* profileAvatarsLoadSaga() {
    try {
        const avatars = yield* call(Node.getAvatars, "");
        yield* put(profileAvatarsLoaded(avatars));
    } catch (e) {
        yield* put(profileAvatarsLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* profileAvatarCreateSaga(action: ProfileAvatarCreateAction) {
    try {
        const avatar = yield* call(Node.createAvatar, "", action.payload.avatar);
        yield* put(profileAvatarCreated(avatar));
        const onCreate = yield* select(state => state.profile.avatarEditDialog.onCreate);
        if (onCreate) {
            onCreate(avatar);
        }
        yield* put(settingsUpdate([{
            name: CLIENT_SETTINGS_PREFIX + "avatar.shape.default",
            value: avatar.shape ?? null
        }]));
    } catch (e) {
        yield* put(profileAvatarCreateFailed());
        yield* put(errorThrown(e));
    }
}

function* profileAvatarDeleteSaga(action: ProfileAvatarDeleteAction) {
    const {id, onDeleted} = action.payload;

    try {
        yield* call(Node.deleteAvatar, "", id);
        yield* put(profileAvatarDeleted(id));
        if (onDeleted) {
            onDeleted(id);
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* profileAvatarsReorderSaga() {
    const ids = yield* select(state => getAvatars(state).map(av => av.id));
    ids.reverse();
    try {
        yield* call(Node.reorderAvatars, "", {ids});
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

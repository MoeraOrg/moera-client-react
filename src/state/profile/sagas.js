import { call, put, select } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import {
    PROFILE_AVATAR_CREATE,
    PROFILE_AVATAR_DELETE,
    PROFILE_AVATARS_LOAD,
    PROFILE_IMAGE_UPLOAD,
    PROFILE_LOAD,
    PROFILE_UPDATE,
    profileAvatarCreated,
    profileAvatarCreateFailed,
    profileAvatarDeleted,
    profileAvatarsLoaded,
    profileAvatarsLoadFailed,
    profileImageUploaded,
    profileImageUploadFailed,
    profileLoadFailed,
    profileSet,
    profileUpdateFailed,
    profileUpdateSucceeded
} from "state/profile/actions";
import { Node } from "api/node";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";
import { messageBox } from "state/messagebox/actions";

export default [
    executor(PROFILE_LOAD, "", introduce(profileLoadSaga)),
    executor(PROFILE_UPDATE, null, profileUpdateSaga),
    executor(PROFILE_IMAGE_UPLOAD, null, profileImageUploadSaga),
    executor(PROFILE_AVATARS_LOAD, "", profileAvatarsLoadSaga),
    executor(PROFILE_AVATAR_CREATE, "", profileAvatarCreateSaga),
    executor(PROFILE_AVATAR_DELETE, payload => payload.id, profileAvatarDeleteSaga)
];

function* profileLoadSaga(action) {
    try {
        const data = yield call(Node.getProfile, "", action.payload.withSource);
        yield put(profileSet(data));
    } catch (e) {
        yield put(profileLoadFailed());
        yield put(errorThrown(e));
    }
}

function* profileUpdateSaga(action) {
    try {
        const data = yield call(Node.putProfile, "", action.payload);
        yield put(profileUpdateSucceeded());
        yield put(profileSet(data));
    } catch (e) {
        yield put(profileUpdateFailed());
        yield put(errorThrown(e));
    }
}

function* profileImageUploadSaga(action) {
    try {
        const {id, path, width, height} = yield call(Node.postMediaPublic, "", action.payload.file);
        if (width < 200 || height < 200) {
            yield put(messageBox("Avatar image size should be at least 200x200 pixels."));
            yield put(profileImageUploadFailed());
        } else {
            yield put(profileImageUploaded(id, path, width, height));
        }
    } catch (e) {
        yield put(profileImageUploadFailed());
        yield put(errorThrown(e));
    }
}

function* profileAvatarsLoadSaga() {
    try {
        const data = yield call(Node.getAvatars, "");
        yield put(profileAvatarsLoaded(data));
    } catch (e) {
        yield put(profileAvatarsLoadFailed());
        yield put(errorThrown(e));
    }
}

function* profileAvatarCreateSaga(action) {
    try {
        const data = yield call(Node.postAvatar, "", action.payload.avatar);
        yield put(profileAvatarCreated(data));
        const onCreate = yield select(state => state.profile.avatarEditDialog.onCreate);
        if (onCreate) {
            onCreate(data);
        }
    } catch (e) {
        yield put(profileAvatarCreateFailed());
        yield put(errorThrown(e));
    }
}

function* profileAvatarDeleteSaga(action) {
    const {id, onDeleted} = action.payload;

    try {
        yield call(Node.deleteAvatar, "", id);
        yield put(profileAvatarDeleted(id));
        if (onDeleted) {
            onDeleted(id);
        }
    } catch (e) {
        yield put(errorThrown(e));
    }
}

import { call, put } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import {
    PROFILE_IMAGE_UPLOAD,
    PROFILE_LOAD,
    PROFILE_UPDATE,
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
    executor(PROFILE_IMAGE_UPLOAD, null, profileImageUploadSaga)
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
        const {path, width, height} = yield call(Node.postMediaPublic, "", action.payload.file);
        if (width < 200 || height < 200) {
            yield put(messageBox("Avatar image size should be at least 200x200 pixels."));
            yield put(profileImageUploadFailed());
        } else {
            yield put(profileImageUploaded(path, width, height));
        }
    } catch (e) {
        yield put(profileImageUploadFailed());
        yield put(errorThrown(e));
    }
}

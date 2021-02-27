import { call, put } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import {
    PROFILE_LOAD,
    PROFILE_UPDATE,
    profileLoadFailed,
    profileSet,
    profileUpdateFailed,
    profileUpdateSucceeded
} from "state/profile/actions";
import { Node } from "api/node";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";

export default [
    executor(PROFILE_LOAD, "", introduce(profileLoadSaga)),
    executor(PROFILE_UPDATE, null, profileUpdateSaga)
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

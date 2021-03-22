import { call, put } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import { HomeNotConnectedError, Node, NodeApiError } from "api";
import {
    SETTINGS_CHANGE_PASSWORD,
    SETTINGS_CLIENT_VALUES_LOAD,
    SETTINGS_NODE_META_LOAD,
    SETTINGS_NODE_VALUES_LOAD,
    SETTINGS_UPDATE,
    SETTINGS_UPDATE_SUCCEEDED,
    settingsChangedPassword,
    settingsChangePasswordFailed,
    settingsClientValuesLoaded,
    settingsClientValuesLoadFailed,
    settingsNodeMetaLoaded,
    settingsNodeMetaLoadFailed,
    settingsNodeValuesLoaded,
    settingsNodeValuesLoadFailed,
    settingsUpdateFailed,
    settingsUpdateSucceeded
} from "state/settings/actions";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";

export default [
    executor(SETTINGS_NODE_VALUES_LOAD, "", introduce(settingsNodeValuesLoadSaga)),
    executor(SETTINGS_NODE_META_LOAD, "", introduce(settingsNodeMetaLoadSaga)),
    executor(SETTINGS_CLIENT_VALUES_LOAD, "", introduce(settingsClientValuesLoadSaga)),
    executor(SETTINGS_UPDATE, null, settingsUpdateSaga),
    executor(SETTINGS_UPDATE_SUCCEEDED, null, settingsUpdateSucceededSaga),
    executor(SETTINGS_CHANGE_PASSWORD, "", settingsChangePasswordSaga)
];

function* settingsNodeValuesLoadSaga() {
    try {
        const data = yield call(Node.getNodeSettings, ":");
        yield put(settingsNodeValuesLoaded(data));
    } catch (e) {
        yield put(settingsNodeValuesLoadFailed());
        yield put(errorThrown(e));
    }
}

function* settingsNodeMetaLoadSaga() {
    try {
        const data = yield call(Node.getNodeSettingsMetadata, ":");
        yield put(settingsNodeMetaLoaded(data));
    } catch (e) {
        yield put(settingsNodeMetaLoadFailed());
        yield put(errorThrown(e));
    }
}

function* settingsClientValuesLoadSaga() {
    try {
        const data = yield call(Node.getClientSettings, ":");
        yield put(settingsClientValuesLoaded(data));
    } catch (e) {
        if (e instanceof HomeNotConnectedError) {
            yield put(settingsClientValuesLoaded([]));
        } else {
            yield put(settingsClientValuesLoadFailed());
            yield put(errorThrown(e));
        }
    }
}

function* settingsUpdateSaga(action) {
    const {settings, onSuccess} = action.payload;

    try {
        yield call(Node.putSettings, ":", settings);
        yield put(settingsUpdateSucceeded(settings, onSuccess));
    } catch (e) {
        yield put(settingsUpdateFailed());
        yield put(errorThrown(e));
    }
}

function settingsUpdateSucceededSaga(action) {
    if (action.payload.onSuccess != null) {
        action.payload.onSuccess();
    }
}

function* settingsChangePasswordSaga(action) {
    const {oldPassword, password, onLoginIncorrect} = action.payload;

    try {
        yield call(Node.putCredentials, ":", null, oldPassword, "admin", password);
        yield put(settingsChangedPassword());
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "credentials.login-incorrect" && onLoginIncorrect != null) {
            onLoginIncorrect();
        }
        yield put(settingsChangePasswordFailed());
        yield put(errorThrown(e));
    }
}

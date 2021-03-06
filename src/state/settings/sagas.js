import { call, put, select } from 'redux-saga/effects';

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
import { getSettingsClientMeta } from "state/settings/selectors";
import { PREFIX } from "api/settings";

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
        let data = yield call(Node.getClientSettings, ":");
        if (window.Android) {
            const mobileData = window.Android.loadSettings();
            if (mobileData != null) {
                const mobileSettings = JSON.parse(mobileData).map(t => ({name: PREFIX + t.name, value: t.value}));
                data = data.concat(mobileSettings);
            }
        }
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

function isMobileSetting(meta, name) {
    return meta.has(name) && meta.get(name).mobile;
}

function* settingsUpdateSaga(action) {
    const {settings, onSuccess} = action.payload;

    const clientMeta = yield select(getSettingsClientMeta);
    const toHome = settings.filter(t => !isMobileSetting(clientMeta, t.name));
    const toMobile = settings
        .filter(t => isMobileSetting(clientMeta, t.name))
        .map(t => ({name: t.name.substring(PREFIX.length), value: t.value}));
    try {
        yield call(Node.putSettings, ":", toHome);
        if (window.Android && toMobile.length > 0) {
            window.Android.storeSettings(JSON.stringify(toMobile));
        }
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

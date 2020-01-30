import { call, put } from '@redux-saga/core/effects';

import { errorThrown } from "state/error/actions";
import { Home, HomeNotConnectedError } from "api";
import {
    settingsClientValuesLoaded,
    settingsClientValuesLoadFailed,
    settingsNodeMetaLoaded,
    settingsNodeMetaLoadFailed,
    settingsNodeValuesLoaded,
    settingsNodeValuesLoadFailed,
    settingsUpdateFailed,
    settingsUpdateSucceeded
} from "state/settings/actions";

export function* settingsNodeValuesLoadSaga() {
    try {
        const data = yield call(Home.getNodeSettings);
        yield put(settingsNodeValuesLoaded(data));
    } catch (e) {
        yield put(settingsNodeValuesLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* settingsNodeMetaLoadSaga() {
    try {
        const data = yield call(Home.getNodeSettingsMetadata);
        yield put(settingsNodeMetaLoaded(data));
    } catch (e) {
        yield put(settingsNodeMetaLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* settingsClientValuesLoadSaga() {
    try {
        const data = yield call(Home.getClientSettings);
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

export function* settingsUpdateSaga(action) {
    const {settings, onSuccess} = action.payload;

    try {
        yield call(Home.putSettings, settings);
        yield put(settingsUpdateSucceeded(settings, onSuccess));
    } catch (e) {
        yield put(settingsUpdateFailed());
        yield put(errorThrown(e));
    }
}

export function* settingsUpdateSucceededSaga(action) {
    if (action.payload.onSuccess != null) {
        action.payload.onSuccess();
    }
}

import { call, put, select } from 'typed-redux-saga/macro';

import { errorThrown } from "state/error/actions";
import { HomeNotConnectedError, Node, NodeApiError } from "api";
import { ClientSettingMetaInfo, PREFIX } from "api/settings";
import {
    SETTINGS_CHANGE_PASSWORD,
    SETTINGS_CLIENT_VALUES_LOAD,
    SETTINGS_NODE_META_LOAD,
    SETTINGS_NODE_VALUES_LOAD,
    SETTINGS_UPDATE,
    SETTINGS_UPDATE_SUCCEEDED,
    settingsChangedPassword,
    SettingsChangePasswordAction,
    settingsChangePasswordFailed,
    settingsClientValuesLoaded,
    settingsClientValuesLoadFailed,
    settingsNodeMetaLoaded,
    settingsNodeMetaLoadFailed,
    settingsNodeValuesLoaded,
    settingsNodeValuesLoadFailed,
    SettingsUpdateAction,
    settingsUpdateFailed,
    settingsUpdateSucceeded,
    SettingsUpdateSucceededAction
} from "state/settings/actions";
import { executor } from "state/executor";
import { getSettingsClientMeta } from "state/settings/selectors";
import { introduced } from "state/init-selectors";

export default [
    executor(SETTINGS_NODE_VALUES_LOAD, "", settingsNodeValuesLoadSaga, introduced),
    executor(SETTINGS_NODE_META_LOAD, "", settingsNodeMetaLoadSaga, introduced),
    executor(SETTINGS_CLIENT_VALUES_LOAD, "", settingsClientValuesLoadSaga, introduced),
    executor(SETTINGS_UPDATE, null, settingsUpdateSaga),
    executor(SETTINGS_UPDATE_SUCCEEDED, null, settingsUpdateSucceededSaga),
    executor(SETTINGS_CHANGE_PASSWORD, "", settingsChangePasswordSaga)
];

function* settingsNodeValuesLoadSaga() {
    try {
        const data = yield* call(Node.getNodeSettings, ":");
        yield* put(settingsNodeValuesLoaded(data));
    } catch (e) {
        yield* put(settingsNodeValuesLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* settingsNodeMetaLoadSaga() {
    try {
        const data = yield* call(Node.getNodeSettingsMetadata, ":");
        yield* put(settingsNodeMetaLoaded(data));
    } catch (e) {
        yield* put(settingsNodeMetaLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* settingsClientValuesLoadSaga() {
    try {
        let data = yield* call(Node.getClientSettings, ":");
        if (window.Android) {
            const mobileData = window.Android.loadSettings();
            if (mobileData != null) {
                const mobileSettings = JSON.parse(mobileData)
                    .map((t: {name: string, value: string}) => ({name: PREFIX + t.name, value: t.value}));
                data = data.concat(mobileSettings);
            }
        }
        yield* put(settingsClientValuesLoaded(data));
    } catch (e) {
        if (e instanceof HomeNotConnectedError) {
            yield* put(settingsClientValuesLoaded([]));
        } else {
            yield* put(settingsClientValuesLoadFailed());
            yield* put(errorThrown(e));
        }
    }
}

function isMobileSetting(meta: Map<string, ClientSettingMetaInfo>, name: string): boolean {
    return meta.get(name)?.scope === "mobile";
}

function* settingsUpdateSaga(action: SettingsUpdateAction) {
    const {settings, onSuccess} = action.payload;

    const clientMeta = yield* select(getSettingsClientMeta);
    const toHome = settings.filter(t => !isMobileSetting(clientMeta, t.name));
    const toMobile = settings
        .filter(t => isMobileSetting(clientMeta, t.name))
        .map(t => ({name: t.name.substring(PREFIX.length), value: t.value}));
    try {
        yield* call(Node.putSettings, ":", toHome);
        if (window.Android && toMobile.length > 0) {
            window.Android.storeSettings(JSON.stringify(toMobile));
        }
        yield* put(settingsUpdateSucceeded(settings, onSuccess));
    } catch (e) {
        yield* put(settingsUpdateFailed());
        yield* put(errorThrown(e));
    }
}

function settingsUpdateSucceededSaga(action: SettingsUpdateSucceededAction) {
    if (action.payload.onSuccess != null) {
        action.payload.onSuccess();
    }
}

function* settingsChangePasswordSaga(action: SettingsChangePasswordAction) {
    const {oldPassword, password, onLoginIncorrect} = action.payload;

    try {
        yield* call(Node.putCredentials, ":", null, oldPassword, "admin", password);
        yield* put(settingsChangedPassword());
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "credentials.login-incorrect" && onLoginIncorrect != null) {
            onLoginIncorrect();
        }
        yield* put(settingsChangePasswordFailed());
        yield* put(errorThrown(e));
    }
}

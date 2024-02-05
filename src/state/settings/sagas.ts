import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { findPreferredLanguage } from "i18n";
import {
    CLIENT_SETTINGS_PREFIX,
    ClientSettingMetaInfo,
    HomeNotConnectedError,
    Node,
    NodeApiError,
    SettingInfo
} from "api";
import { Storage } from "storage";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { homeIntroduced } from "state/init-selectors";
import {
    settingsChangedPassword,
    SettingsChangePasswordAction,
    settingsChangePasswordFailed,
    SettingsClientValuesLoadAction,
    settingsClientValuesLoaded,
    SettingsClientValuesLoadedAction,
    settingsClientValuesLoadFailed,
    SettingsClientValuesSetAction,
    SettingsDeleteNodeRequestCancelAction,
    SettingsDeleteNodeRequestLoadAction,
    settingsDeleteNodeRequestLoaded,
    settingsDeleteNodeRequestLoadFailed,
    SettingsDeleteNodeRequestSendAction,
    settingsDeleteNodeRequestStatusSet,
    settingsDeleteNodeRequestUpdateFailed,
    settingsLanguageChanged,
    SettingsNodeMetaLoadAction,
    settingsNodeMetaLoaded,
    settingsNodeMetaLoadFailed,
    SettingsNodeValuesLoadAction,
    settingsNodeValuesLoaded,
    settingsNodeValuesLoadFailed,
    SettingsPluginsDeleteAction,
    settingsPluginsDeleted,
    SettingsPluginsLoadAction,
    settingsPluginsLoaded,
    settingsPluginsLoadFailed,
    SettingsRemindSetSheriffGooglePlayAction,
    settingsRemindSetSheriffGooglePlayChoice,
    SettingsRemindSetSheriffGooglePlayChoiceAction,
    SettingsTokensCreateAction,
    settingsTokensCreated,
    settingsTokensCreateFailed,
    SettingsTokensDeleteAction,
    settingsTokensDeleted,
    SettingsTokensLoadAction,
    settingsTokensLoaded,
    settingsTokensLoadFailed,
    SettingsTokensNewTokenCopyAction,
    SettingsTokensUpdateAction,
    settingsTokensUpdated,
    settingsTokensUpdateFailed,
    settingsUpdate,
    SettingsUpdateAction,
    settingsUpdateFailed,
    settingsUpdateSucceeded,
    SettingsUpdateSucceededAction
} from "state/settings/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import { getSetting, getSettingNode, getSettingsClient, getSettingsClientMeta } from "state/settings/selectors";
import { flashBox } from "state/flashbox/actions";
import { confirmBox } from "state/confirmbox/actions";
import * as Browser from "ui/browser";
import { deserializeSheriffs, serializeSheriffs } from "util/sheriff";
import { now } from "util/misc";

export default [
    executor("SETTINGS_NODE_VALUES_LOAD", "", settingsNodeValuesLoadSaga, homeIntroduced),
    executor("SETTINGS_NODE_META_LOAD", "", settingsNodeMetaLoadSaga, homeIntroduced),
    executor("SETTINGS_CLIENT_VALUES_LOAD", "", settingsClientValuesLoadSaga, homeIntroduced),
    executor("SETTINGS_CLIENT_VALUES_LOADED", "", settingsClientValuesLoadedSaga),
    executor("SETTINGS_CLIENT_VALUES_SET", "", settingsClientValuesSetSaga),
    executor("SETTINGS_UPDATE", null, settingsUpdateSaga),
    executor("SETTINGS_UPDATE_SUCCEEDED", null, settingsUpdateSucceededSaga),
    executor("SETTINGS_CHANGE_PASSWORD", "", settingsChangePasswordSaga),
    executor("SETTINGS_TOKENS_LOAD", "", settingsTokensLoadSaga, homeIntroduced),
    executor("SETTINGS_TOKENS_CREATE", null, settingsTokensCreateSaga),
    executor("SETTINGS_TOKENS_UPDATE", payload => payload.id, settingsTokensUpdateSaga),
    executor("SETTINGS_TOKENS_DELETE", payload => payload.id, settingsTokensDeleteSaga),
    executor("SETTINGS_TOKENS_NEW_TOKEN_COPY", null, settingsTokensNewTokenCopySaga),
    executor("SETTINGS_PLUGINS_LOAD", "", settingsPluginsLoadSaga, homeIntroduced),
    executor("SETTINGS_PLUGINS_DELETE", payload => payload.name, settingsPluginsDeleteSaga),
    executor("SETTINGS_REMIND_SET_SHERIFF_GOOGLE_PLAY", "", settingsRemindSetSheriffGooglePlaySaga),
    executor("SETTINGS_REMIND_SET_SHERIFF_GOOGLE_PLAY_CHOICE", "", settingsRemindSetSheriffGooglePlayChoiceSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_LOAD", "", settingsDeleteNodeRequestLoadSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_SEND", "", settingsDeleteNodeRequestSendSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_CANCEL", "", settingsDeleteNodeRequestCancelSaga)
];

function* settingsNodeValuesLoadSaga(action: SettingsNodeValuesLoadAction) {
    try {
        const settings = yield* call(Node.getNodeSettings, action, ":");
        yield* put(settingsNodeValuesLoaded(settings).causedBy(action));
    } catch (e) {
        yield* put(settingsNodeValuesLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsNodeMetaLoadSaga(action: SettingsNodeMetaLoadAction) {
    try {
        const metadata = yield* call(Node.getNodeSettingsMetadata, action, ":");
        yield* put(settingsNodeMetaLoaded(metadata).causedBy(action));
    } catch (e) {
        yield* put(settingsNodeMetaLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function isMobileSetting(meta: Map<string, ClientSettingMetaInfo>, name: string): boolean {
    return meta.get(name)?.scope === "mobile";
}

function isDeviceSetting(meta: Map<string, ClientSettingMetaInfo>, name: string): boolean {
    return meta.get(name)?.scope === "device";
}

function* storeSettings() {
    Storage.storeSettings(yield* select(getSettingsClient));
}

function* settingsClientValuesLoadSaga(action: SettingsClientValuesLoadAction) {
    try {
        let settings = yield* call(Node.getClientSettings, action, ":", CLIENT_SETTINGS_PREFIX);
        if (window.Android) {
            const mobileData = window.Android.loadSettings();
            if (mobileData != null) {
                const mobileSettings = JSON.parse(mobileData)
                    .map((t: {name: string, value: string}) =>
                        ({name: CLIENT_SETTINGS_PREFIX + t.name, value: t.value}));
                settings = settings.concat(mobileSettings);
            }
        }
        const clientMeta = yield* select(getSettingsClientMeta);
        settings = settings.filter(t => !isDeviceSetting(clientMeta, t.name));
        yield* put(settingsClientValuesLoaded(settings).causedBy(action));
    } catch (e) {
        if (e instanceof HomeNotConnectedError) {
            yield* put(settingsClientValuesLoaded([]).causedBy(action));
        } else {
            yield* put(settingsClientValuesLoadFailed().causedBy(action));
            yield* put(errorThrown(e));
        }
    }
}

function* settingsClientValuesLoadedSaga(action: SettingsClientValuesLoadedAction) {
    let lang = yield* select((state: ClientState) => getSetting(state, "language") as string);
    if (lang === "auto") {
        lang = findPreferredLanguage();
    }
    if (lang !== i18n.language) {
        yield* call(i18n.changeLanguage, lang);
        yield* put(settingsLanguageChanged().causedBy(action));
    }
    yield* call(storeSettings);
}

function* updateLanguage(action: ClientAction, settings: SettingInfo[]) {
    let lang = settings.find(st => st.name === CLIENT_SETTINGS_PREFIX + "language")?.value;
    if (lang != null) {
        if (lang === "auto") {
            lang = findPreferredLanguage();
        }
        if (lang !== i18n.language) {
            yield* call(i18n.changeLanguage, lang);
            yield* put(settingsLanguageChanged().causedBy(action));
        }
    }
}

function* settingsClientValuesSetSaga(action: SettingsClientValuesSetAction) {
    const {settings} = action.payload;

    yield* call(updateLanguage, action, settings);
}

function* settingsUpdateSaga(action: SettingsUpdateAction) {
    const {settings, onSuccess} = action.payload;

    yield* call(updateLanguage, action, settings);

    const clientMeta = yield* select(getSettingsClientMeta);
    const toHome = settings
        .filter(t => !isMobileSetting(clientMeta, t.name) && !isDeviceSetting(clientMeta, t.name));
    const toMobile = settings
        .filter(t => isMobileSetting(clientMeta, t.name))
        .map(t => ({name: t.name.substring(CLIENT_SETTINGS_PREFIX.length), value: t.value}));
    try {
        yield* call(Node.updateSettings, action, ":", toHome);
        if (window.Android && toMobile.length > 0) {
            window.Android.storeSettings(JSON.stringify(toMobile));
        }
        yield* put(settingsUpdateSucceeded(settings, onSuccess).causedBy(action));
        yield* call(storeSettings);
    } catch (e) {
        yield* put(settingsUpdateFailed().causedBy(action));
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
        yield* call(Node.updateCredentials, action, ":", {oldPassword, login: "admin", password},
            ["credentials.wrong-reset-token", "credentials.reset-token-expired", "credentials.login-incorrect"]);
        yield* put(settingsChangedPassword().causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "credentials.login-incorrect" && onLoginIncorrect != null) {
            onLoginIncorrect();
        } else {
            yield* put(errorThrown(e));
        }
        yield* put(settingsChangePasswordFailed().causedBy(action));
    }
}

function* settingsTokensLoadSaga(action: SettingsTokensLoadAction) {
    try {
        const tokens = yield* call(Node.getTokens, action, ":");
        yield* put(settingsTokensLoaded(tokens).causedBy(action));
    } catch (e) {
        yield* put(settingsTokensLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsTokensCreateSaga(action: SettingsTokensCreateAction) {
    const {password, name, onLoginIncorrect} = action.payload;

    try {
        const token = yield* call(Node.createToken, action, ":", {login: "admin", password, name},
            ["credentials.login-incorrect", "credentials.not-created"]);
        yield* put(settingsTokensCreated(token).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "credentials.login-incorrect" && onLoginIncorrect != null) {
            onLoginIncorrect();
        } else {
            yield* put(errorThrown(e));
        }
        yield* put(settingsTokensCreateFailed().causedBy(action));
    }
}

function* settingsTokensUpdateSaga(action: SettingsTokensUpdateAction) {
    const {id, name} = action.payload;

    try {
        const token = yield* call(Node.updateToken, action, ":", id, {name});
        yield* put(settingsTokensUpdated(token).causedBy(action));
    } catch (e) {
        yield* put(settingsTokensUpdateFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsTokensDeleteSaga(action: SettingsTokensDeleteAction) {
    const {id} = action.payload;

    try {
        yield* call(Node.deleteToken, action, ":", id);
        yield* put(settingsTokensDeleted(id).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* settingsTokensNewTokenCopySaga(action: SettingsTokensNewTokenCopyAction) {
    const token = yield* select(state => state.settings.tokens.dialog.newToken);
    yield* call(clipboardCopy, token.token);
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("token-copied")).causedBy(action));
    }
}

function* settingsPluginsLoadSaga(action: SettingsPluginsLoadAction) {
    try {
        const plugins = yield* call(Node.getPlugins, action, ":");
        yield* put(settingsPluginsLoaded(plugins).causedBy(action));
    } catch (e) {
        yield* put(settingsPluginsLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsPluginsDeleteSaga(action: SettingsPluginsDeleteAction) {
    const {name, tokenId} = action.payload;

    try {
        yield* call(Node.deleteToken, action, ":", tokenId);
        yield* put(settingsTokensDeleted(tokenId).causedBy(action));
        yield* call(Node.unregisterPlugin, action, ":", name);
        yield* put(settingsPluginsDeleted(name).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* settingsRemindSetSheriffGooglePlaySaga(action: SettingsRemindSetSheriffGooglePlayAction) {
    const count = yield* select(state => getSetting(state, "sheriff.google-play.reminder.count") as number);
    yield* put(confirmBox(
        i18n.t("do-want-allow-android-google-play"), null, null, settingsRemindSetSheriffGooglePlayChoice(true),
        settingsRemindSetSheriffGooglePlayChoice(false), "primary",
        count < 2 ? i18n.t("remind-later") : i18n.t("stop-asking"), settingsRemindSetSheriffGooglePlayChoice(null)
    ).causedBy(action));
}

function* settingsRemindSetSheriffGooglePlayChoiceSaga(action: SettingsRemindSetSheriffGooglePlayChoiceAction) {
    const {sheriffs, count} = yield* select(state => ({
        sheriffs: deserializeSheriffs(getSettingNode(state, "sheriffs.timeline") as string),
        count: getSetting(state, "sheriff.google-play.reminder.count") as number
    }));
    const updates: SettingInfo[] = [];
    if (action.payload.allow === true) {
        updates.push(
            {name: "sheriffs.timeline", value: serializeSheriffs(sheriffs.concat(SHERIFF_GOOGLE_PLAY_TIMELINE))},
            {name: CLIENT_SETTINGS_PREFIX + "sheriff.google-play.reminder.count", value: "3"}
        );
    } else if (action.payload.allow === false) {
        updates.push(
            {name: CLIENT_SETTINGS_PREFIX + "sheriff.google-play.reminder.count", value: "3"}
        );
    } else {
        updates.push(
            {name: CLIENT_SETTINGS_PREFIX + "sheriff.google-play.reminder.count", value: String(count + 1)},
            {name: CLIENT_SETTINGS_PREFIX + "sheriff.google-play.reminder.shown-at", value: String(now())}
        );
    }
    yield* put(settingsUpdate(updates).causedBy(action));
}

function* settingsDeleteNodeRequestLoadSaga(action: SettingsDeleteNodeRequestLoadAction) {
    try {
        const status = yield* call(Node.getDeleteNodeRequestStatus, action, ":");
        yield* put(settingsDeleteNodeRequestLoaded(status.requested).causedBy(action));
    } catch (e) {
        yield* put(settingsDeleteNodeRequestLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsDeleteNodeRequestSendSaga(action: SettingsDeleteNodeRequestSendAction) {
    try {
        const status = yield* call(Node.sendDeleteNodeRequest, action, ":", {message: action.payload.message});
        yield* put(settingsDeleteNodeRequestStatusSet(status.requested).causedBy(action));
    } catch (e) {
        yield* put(settingsDeleteNodeRequestUpdateFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsDeleteNodeRequestCancelSaga(action: SettingsDeleteNodeRequestCancelAction) {
    try {
        const status = yield* call(Node.cancelDeleteNodeRequest, action, ":");
        yield* put(settingsDeleteNodeRequestStatusSet(status.requested).causedBy(action));
    } catch (e) {
        yield* put(settingsDeleteNodeRequestUpdateFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

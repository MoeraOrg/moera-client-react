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
    SettingsGrantsDeleteAction,
    settingsGrantsDeleted,
    SettingsGrantsDialogConfirmAction,
    settingsGrantsDialogConfirmed,
    settingsGrantsDialogConfirmFailed,
    SettingsGrantsLoadAction,
    settingsGrantsLoaded,
    settingsGrantsLoadFailed,
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
    SettingsUpdateAction,
    settingsUpdateFailed,
    settingsUpdateSucceeded,
    SettingsUpdateSucceededAction
} from "state/settings/actions";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import { getSetting, getSettingsClient, getSettingsClientMeta } from "state/settings/selectors";
import { flashBox } from "state/flashbox/actions";
import { messageBox } from "state/messagebox/actions";
import * as Browser from "ui/browser";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("SETTINGS_NODE_VALUES_LOAD", "", settingsNodeValuesLoadSaga, homeIntroduced),
    executor("SETTINGS_NODE_META_LOAD", "", settingsNodeMetaLoadSaga, homeIntroduced),
    executor("SETTINGS_CLIENT_VALUES_LOAD", "", settingsClientValuesLoadSaga, homeIntroduced),
    executor("SETTINGS_CLIENT_VALUES_LOADED", "", settingsClientValuesLoadedSaga),
    executor("SETTINGS_CLIENT_VALUES_SET", "", settingsClientValuesSetSaga),
    executor("SETTINGS_UPDATE", null, settingsUpdateSaga),
    executor("SETTINGS_UPDATE_SUCCEEDED", null, settingsUpdateSucceededSaga),
    executor("SETTINGS_CHANGE_PASSWORD", "", settingsChangePasswordSaga),
    executor("SETTINGS_GRANTS_LOAD", "", settingsGrantsLoadSaga, homeIntroduced),
    executor("SETTINGS_GRANTS_DIALOG_CONFIRM", payload => payload.nodeName, settingsGrantsDialogConfirmSaga),
    executor("SETTINGS_GRANTS_DELETE", payload => payload.nodeName, settingsGrantsDeleteSaga),
    executor("SETTINGS_TOKENS_LOAD", "", settingsTokensLoadSaga, homeIntroduced),
    executor("SETTINGS_TOKENS_CREATE", null, settingsTokensCreateSaga),
    executor("SETTINGS_TOKENS_UPDATE", payload => payload.id, settingsTokensUpdateSaga),
    executor("SETTINGS_TOKENS_DELETE", payload => payload.id, settingsTokensDeleteSaga),
    executor("SETTINGS_TOKENS_NEW_TOKEN_COPY", null, settingsTokensNewTokenCopySaga),
    executor("SETTINGS_PLUGINS_LOAD", "", settingsPluginsLoadSaga, homeIntroduced),
    executor("SETTINGS_PLUGINS_DELETE", payload => payload.name, settingsPluginsDeleteSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_LOAD", "", settingsDeleteNodeRequestLoadSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_SEND", "", settingsDeleteNodeRequestSendSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_CANCEL", "", settingsDeleteNodeRequestCancelSaga)
];

function* settingsNodeValuesLoadSaga(action: WithContext<SettingsNodeValuesLoadAction>) {
    try {
        const settings = yield* call(Node.getNodeSettings, action, REL_HOME);
        yield* put(settingsNodeValuesLoaded(settings).causedBy(action));
    } catch (e) {
        yield* put(settingsNodeValuesLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsNodeMetaLoadSaga(action: WithContext<SettingsNodeMetaLoadAction>) {
    try {
        const metadata = yield* call(Node.getNodeSettingsMetadata, action, REL_HOME);
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

function* settingsClientValuesLoadSaga(action: WithContext<SettingsClientValuesLoadAction>) {
    try {
        let settings = yield* call(Node.getClientSettings, action, REL_HOME, CLIENT_SETTINGS_PREFIX);
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
        yield* call(Browser.changeLanguage, lang);
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
            yield* call(Browser.changeLanguage, lang);
            yield* put(settingsLanguageChanged().causedBy(action));
        }
    }
}

function* settingsClientValuesSetSaga(action: SettingsClientValuesSetAction) {
    const {settings} = action.payload;

    yield* call(updateLanguage, action, settings);
}

function* settingsUpdateSaga(action: WithContext<SettingsUpdateAction>) {
    const {settings, onSuccess} = action.payload;

    yield* call(updateLanguage, action, settings);

    const clientMeta = yield* select(getSettingsClientMeta);
    const toHome = settings
        .filter(t => !isMobileSetting(clientMeta, t.name) && !isDeviceSetting(clientMeta, t.name));
    const toMobile = settings
        .filter(t => isMobileSetting(clientMeta, t.name))
        .map(t => ({name: t.name.substring(CLIENT_SETTINGS_PREFIX.length), value: t.value}));
    try {
        yield* call(Node.updateSettings, action, REL_HOME, toHome);
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

function* settingsChangePasswordSaga(action: WithContext<SettingsChangePasswordAction>) {
    const {oldPassword, password, onLoginIncorrect} = action.payload;

    try {
        yield* call(Node.updateCredentials, action, REL_HOME, {oldPassword, login: "admin", password},
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

function* settingsGrantsLoadSaga(action: WithContext<SettingsGrantsLoadAction>) {
    try {
        const grants = yield* call(Node.getAllGrants, action, REL_HOME);
        yield* put(settingsGrantsLoaded(grants).causedBy(action));
    } catch (e) {
        yield* put(settingsGrantsLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsGrantsDialogConfirmSaga(action: WithContext<SettingsGrantsDialogConfirmAction>) {
    const {nodeName, revoke} = action.payload;

    try {
        const info = yield* call(Node.grantOrRevoke, action, REL_HOME, nodeName, {scope: revoke, revoke: true});
        yield* put(settingsGrantsDialogConfirmed(nodeName, info.scope).causedBy(action));
    } catch (e) {
        yield* put(settingsGrantsDialogConfirmFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsGrantsDeleteSaga(action: WithContext<SettingsGrantsDeleteAction>) {
    const {nodeName} = action.payload;

    try {
        yield* call(Node.revokeAll, action, REL_HOME, nodeName);
        yield* put(settingsGrantsDeleted(nodeName).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* settingsTokensLoadSaga(action: WithContext<SettingsTokensLoadAction>) {
    try {
        const tokens = yield* call(Node.getTokens, action, REL_HOME);
        yield* put(settingsTokensLoaded(tokens).causedBy(action));
    } catch (e) {
        yield* put(settingsTokensLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsTokensCreateSaga(action: WithContext<SettingsTokensCreateAction>) {
    const {password, name, permissions, onLoginIncorrect} = action.payload;

    try {
        const token = yield* call(Node.createToken, action, REL_HOME, {login: "admin", password, name, permissions},
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

function* settingsTokensUpdateSaga(action: WithContext<SettingsTokensUpdateAction>) {
    const {id, name, permissions} = action.payload;

    try {
        const token = yield* call(Node.updateToken, action, REL_HOME, id, {name, permissions});
        yield* put(settingsTokensUpdated(token).causedBy(action));
    } catch (e) {
        yield* put(settingsTokensUpdateFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsTokensDeleteSaga(action: WithContext<SettingsTokensDeleteAction>) {
    const {id} = action.payload;

    try {
        yield* call(Node.deleteToken, action, REL_HOME, id);
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

function* settingsPluginsLoadSaga(action: WithContext<SettingsPluginsLoadAction>) {
    try {
        const plugins = yield* call(Node.getPlugins, action, REL_HOME);
        yield* put(settingsPluginsLoaded(plugins).causedBy(action));
    } catch (e) {
        yield* put(settingsPluginsLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsPluginsDeleteSaga(action: WithContext<SettingsPluginsDeleteAction>) {
    const {name, tokenId} = action.payload;

    try {
        yield* call(Node.deleteToken, action, REL_HOME, tokenId);
        yield* put(settingsTokensDeleted(tokenId).causedBy(action));
        yield* call(Node.unregisterPlugin, action, REL_HOME, name);
        yield* put(settingsPluginsDeleted(name).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* settingsDeleteNodeRequestLoadSaga(action: WithContext<SettingsDeleteNodeRequestLoadAction>) {
    try {
        const status = yield* call(Node.getDeleteNodeRequestStatus, action, REL_HOME);
        yield* put(settingsDeleteNodeRequestLoaded(status.requested).causedBy(action));
    } catch (e) {
        yield* put(settingsDeleteNodeRequestLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* settingsDeleteNodeRequestSendSaga(action: WithContext<SettingsDeleteNodeRequestSendAction>) {
    try {
        const status = yield* call(Node.sendDeleteNodeRequest, action, REL_HOME, {message: action.payload.message},
            ["delete-node.no-email"]);
        yield* put(settingsDeleteNodeRequestStatusSet(status.requested).causedBy(action));
    } catch (e) {
        yield* put(settingsDeleteNodeRequestUpdateFailed().causedBy(action));
        if (e instanceof NodeApiError) {
            yield* put(messageBox(i18n.t("set-email-provider-contact")));
        } else {
            yield* put(errorThrown(e));
        }
    }
}

function* settingsDeleteNodeRequestCancelSaga(action: WithContext<SettingsDeleteNodeRequestCancelAction>) {
    try {
        const status = yield* call(Node.cancelDeleteNodeRequest, action, REL_HOME);
        yield* put(settingsDeleteNodeRequestStatusSet(status.requested).causedBy(action));
    } catch (e) {
        yield* put(settingsDeleteNodeRequestUpdateFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

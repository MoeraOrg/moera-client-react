import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { findPreferredLanguage } from "i18n";
import {
    CLIENT_SETTINGS_PREFIX,
    ClientSettingMetaInfo,
    HomeNotConnectedError,
    Node,
    NodeApiError, NodeName,
    SettingInfo
} from "api";
import { Storage } from "storage";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
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
    SettingsMnemonicLoadAction,
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
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import { getSetting, getSettingsClient, getSettingsClientMeta } from "state/settings/selectors";
import { mnemonicOpen } from "state/nodename/actions";
import { flashBox } from "state/flashbox/actions";
import { messageBox } from "state/messagebox/actions";
import * as Browser from "ui/browser";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("SETTINGS_NODE_VALUES_LOAD", "", settingsNodeValuesLoadSaga),
    executor("SETTINGS_NODE_META_LOAD", "", settingsNodeMetaLoadSaga),
    executor("SETTINGS_CLIENT_VALUES_LOAD", "", settingsClientValuesLoadSaga),
    executor("SETTINGS_CLIENT_VALUES_LOADED", "", settingsClientValuesLoadedSaga),
    executor("SETTINGS_CLIENT_VALUES_SET", "", settingsClientValuesSetSaga),
    executor("SETTINGS_UPDATE", null, settingsUpdateSaga),
    executor("SETTINGS_UPDATE_SUCCEEDED", null, settingsUpdateSucceededSaga),
    executor("SETTINGS_CHANGE_PASSWORD", "", settingsChangePasswordSaga),
    executor("SETTINGS_MNEMONIC_LOAD", "", settingsMnemonicLoadSaga),
    executor("SETTINGS_GRANTS_LOAD", "", settingsGrantsLoadSaga),
    executor("SETTINGS_GRANTS_DIALOG_CONFIRM", payload => payload.nodeName, settingsGrantsDialogConfirmSaga),
    executor("SETTINGS_GRANTS_DELETE", payload => payload.nodeName, settingsGrantsDeleteSaga),
    executor("SETTINGS_TOKENS_LOAD", "", settingsTokensLoadSaga),
    executor("SETTINGS_TOKENS_CREATE", null, settingsTokensCreateSaga),
    executor("SETTINGS_TOKENS_UPDATE", payload => payload.id, settingsTokensUpdateSaga),
    executor("SETTINGS_TOKENS_DELETE", payload => payload.id, settingsTokensDeleteSaga),
    executor("SETTINGS_TOKENS_NEW_TOKEN_COPY", null, settingsTokensNewTokenCopySaga),
    executor("SETTINGS_PLUGINS_LOAD", "", settingsPluginsLoadSaga),
    executor("SETTINGS_PLUGINS_DELETE", payload => payload.name, settingsPluginsDeleteSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_LOAD", "", settingsDeleteNodeRequestLoadSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_SEND", "", settingsDeleteNodeRequestSendSaga),
    executor("SETTINGS_DELETE_NODE_REQUEST_CANCEL", "", settingsDeleteNodeRequestCancelSaga)
];

async function settingsNodeValuesLoadSaga(action: WithContext<SettingsNodeValuesLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const settings = await Node.getNodeSettings(action, REL_HOME);
        dispatch(settingsNodeValuesLoaded(settings).causedBy(action));
    } catch (e) {
        dispatch(settingsNodeValuesLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsNodeMetaLoadSaga(action: WithContext<SettingsNodeMetaLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const metadata = await Node.getNodeSettingsMetadata(action, REL_HOME);
        dispatch(settingsNodeMetaLoaded(metadata).causedBy(action));
    } catch (e) {
        dispatch(settingsNodeMetaLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

function isMobileSetting(meta: Map<string, ClientSettingMetaInfo>, name: string): boolean {
    return meta.get(name)?.scope === "mobile";
}

function isDeviceSetting(meta: Map<string, ClientSettingMetaInfo>, name: string): boolean {
    return meta.get(name)?.scope === "device";
}

function storeSettings(): void {
    Storage.storeSettings(select(getSettingsClient));
}

async function settingsClientValuesLoadSaga(action: WithContext<SettingsClientValuesLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        let settings = await Node.getClientSettings(action, REL_HOME, CLIENT_SETTINGS_PREFIX);
        if (window.Android) {
            const mobileData = window.Android.loadSettings();
            if (mobileData != null) {
                const mobileSettings = JSON.parse(mobileData)
                    .map((t: {name: string, value: string}) =>
                        ({name: CLIENT_SETTINGS_PREFIX + t.name, value: t.value}));
                settings = settings.concat(mobileSettings);
            }
        }
        const clientMeta = select(getSettingsClientMeta);
        settings = settings.filter(t => !isDeviceSetting(clientMeta, t.name));
        dispatch(settingsClientValuesLoaded(settings).causedBy(action));
    } catch (e) {
        if (e instanceof HomeNotConnectedError) {
            dispatch(settingsClientValuesLoaded([]).causedBy(action));
        } else {
            dispatch(settingsClientValuesLoadFailed().causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function settingsClientValuesLoadedSaga(action: SettingsClientValuesLoadedAction): Promise<void> {
    let lang = select(state => getSetting(state, "language") as string);
    if (lang === "auto") {
        lang = findPreferredLanguage();
    }
    if (lang !== i18n.language) {
        await Browser.changeLanguage(lang);
        dispatch(settingsLanguageChanged().causedBy(action));
    }
    storeSettings();
}

async function updateLanguage(action: ClientAction, settings: SettingInfo[]): Promise<void> {
    let lang = settings.find(st => st.name === CLIENT_SETTINGS_PREFIX + "language")?.value;
    if (lang != null) {
        if (lang === "auto") {
            lang = findPreferredLanguage();
        }
        if (lang !== i18n.language) {
            await Browser.changeLanguage(lang);
            dispatch(settingsLanguageChanged().causedBy(action));
        }
    }
}

async function settingsClientValuesSetSaga(action: SettingsClientValuesSetAction): Promise<void> {
    const {settings} = action.payload;

    await updateLanguage(action, settings);
}

async function settingsUpdateSaga(action: WithContext<SettingsUpdateAction>): Promise<void> {
    const {settings, onSuccess} = action.payload;

    await updateLanguage(action, settings);

    const clientMeta = select(getSettingsClientMeta);
    const toHome = settings
        .filter(t => !isMobileSetting(clientMeta, t.name) && !isDeviceSetting(clientMeta, t.name));
    const toMobile = settings
        .filter(t => isMobileSetting(clientMeta, t.name))
        .map(t => ({name: t.name.substring(CLIENT_SETTINGS_PREFIX.length), value: t.value}));
    try {
        await Node.updateSettings(action, REL_HOME, toHome);
        if (window.Android && toMobile.length > 0) {
            window.Android.storeSettings(JSON.stringify(toMobile));
        }
        dispatch(settingsUpdateSucceeded(settings, onSuccess).causedBy(action));
        storeSettings();
    } catch (e) {
        dispatch(settingsUpdateFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

function settingsUpdateSucceededSaga(action: SettingsUpdateSucceededAction): void {
    if (action.payload.onSuccess != null) {
        action.payload.onSuccess();
    }
}

async function settingsChangePasswordSaga(action: WithContext<SettingsChangePasswordAction>): Promise<void> {
    const {oldPassword, password, onLoginIncorrect} = action.payload;

    try {
        await Node.updateCredentials(
            action, REL_HOME, {oldPassword, login: "admin", password},
            ["credentials.wrong-reset-token", "credentials.reset-token-expired", "credentials.login-incorrect"]
        );
        dispatch(settingsChangedPassword().causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "credentials.login-incorrect" && onLoginIncorrect != null) {
            onLoginIncorrect();
        } else {
            dispatch(errorThrown(e));
        }
        dispatch(settingsChangePasswordFailed().causedBy(action));
    }
}

async function settingsMnemonicLoadSaga(action: WithContext<SettingsMnemonicLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const keyMnemonic = await Node.getStoredMnemonic(action, REL_HOME);
        if (action.context.homeOwnerName != null) {
            const name = NodeName.shorten(action.context.homeOwnerName);
            dispatch(mnemonicOpen(name, keyMnemonic.mnemonic).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function settingsGrantsLoadSaga(action: WithContext<SettingsGrantsLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const grants = await Node.getAllGrants(action, REL_HOME);
        dispatch(settingsGrantsLoaded(grants).causedBy(action));
    } catch (e) {
        dispatch(settingsGrantsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsGrantsDialogConfirmSaga(action: WithContext<SettingsGrantsDialogConfirmAction>): Promise<void> {
    const {nodeName, revoke} = action.payload;

    try {
        const info = await Node.grantOrRevoke(action, REL_HOME, nodeName, {scope: revoke, revoke: true});
        dispatch(settingsGrantsDialogConfirmed(nodeName, info.scope).causedBy(action));
    } catch (e) {
        dispatch(settingsGrantsDialogConfirmFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsGrantsDeleteSaga(action: WithContext<SettingsGrantsDeleteAction>): Promise<void> {
    const {nodeName} = action.payload;

    try {
        await Node.revokeAll(action, REL_HOME, nodeName);
        dispatch(settingsGrantsDeleted(nodeName).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function settingsTokensLoadSaga(action: WithContext<SettingsTokensLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const tokens = await Node.getTokens(action, REL_HOME);
        dispatch(settingsTokensLoaded(tokens).causedBy(action));
    } catch (e) {
        dispatch(settingsTokensLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsTokensCreateSaga(action: WithContext<SettingsTokensCreateAction>): Promise<void> {
    const {password, name, permissions, onLoginIncorrect} = action.payload;

    try {
        const token = await Node.createToken(
            action, REL_HOME, {login: "admin", password, name, permissions},
            ["credentials.login-incorrect", "credentials.not-created"]
        );
        dispatch(settingsTokensCreated(token).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError && e.errorCode === "credentials.login-incorrect" && onLoginIncorrect != null) {
            onLoginIncorrect();
        } else {
            dispatch(errorThrown(e));
        }
        dispatch(settingsTokensCreateFailed().causedBy(action));
    }
}

async function settingsTokensUpdateSaga(action: WithContext<SettingsTokensUpdateAction>): Promise<void> {
    const {id, name, permissions} = action.payload;

    try {
        const token = await Node.updateToken(action, REL_HOME, id, {name, permissions});
        dispatch(settingsTokensUpdated(token).causedBy(action));
    } catch (e) {
        dispatch(settingsTokensUpdateFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsTokensDeleteSaga(action: WithContext<SettingsTokensDeleteAction>): Promise<void> {
    const {id} = action.payload;

    try {
        await Node.deleteToken(action, REL_HOME, id);
        dispatch(settingsTokensDeleted(id).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function settingsTokensNewTokenCopySaga(action: SettingsTokensNewTokenCopyAction): Promise<void> {
    const token = select().settings.tokens.dialog.newToken;
    if (token == null) {
        return;
    }
    await clipboardCopy(token.token);
    if (!Browser.isAndroidBrowser()) {
        dispatch(flashBox(i18n.t("token-copied")).causedBy(action));
    }
}

async function settingsPluginsLoadSaga(action: WithContext<SettingsPluginsLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const plugins = await Node.getPlugins(action, REL_HOME);
        dispatch(settingsPluginsLoaded(plugins).causedBy(action));
    } catch (e) {
        dispatch(settingsPluginsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsPluginsDeleteSaga(action: WithContext<SettingsPluginsDeleteAction>): Promise<void> {
    const {name, tokenId} = action.payload;

    try {
        await Node.deleteToken(action, REL_HOME, tokenId);
        dispatch(settingsTokensDeleted(tokenId).causedBy(action));
        await Node.unregisterPlugin(action, REL_HOME, name);
        dispatch(settingsPluginsDeleted(name).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function settingsDeleteNodeRequestLoadSaga(
    action: WithContext<SettingsDeleteNodeRequestLoadAction>
): Promise<void> {
    try {
        const status = await Node.getDeleteNodeRequestStatus(action, REL_HOME);
        dispatch(settingsDeleteNodeRequestLoaded(status.requested).causedBy(action));
    } catch (e) {
        dispatch(settingsDeleteNodeRequestLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function settingsDeleteNodeRequestSendSaga(
    action: WithContext<SettingsDeleteNodeRequestSendAction>
): Promise<void> {
    try {
        const status = await Node.sendDeleteNodeRequest(
            action, REL_HOME, {message: action.payload.message}, ["delete-node.no-email"]
        );
        dispatch(settingsDeleteNodeRequestStatusSet(status.requested).causedBy(action));
    } catch (e) {
        dispatch(settingsDeleteNodeRequestUpdateFailed().causedBy(action));
        if (e instanceof NodeApiError) {
            dispatch(messageBox(i18n.t("set-email-provider-contact")));
        } else {
            dispatch(errorThrown(e));
        }
    }
}

async function settingsDeleteNodeRequestCancelSaga(
    action: WithContext<SettingsDeleteNodeRequestCancelAction>
): Promise<void> {
    try {
        const status = await Node.cancelDeleteNodeRequest(action, REL_HOME);
        dispatch(settingsDeleteNodeRequestStatusSet(status.requested).causedBy(action));
    } catch (e) {
        dispatch(settingsDeleteNodeRequestUpdateFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

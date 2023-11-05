import i18n from 'i18next';

import { conj, inv, trigger } from "state/trigger";
import { isAtSettingsPage } from "state/navigation/selectors";
import {
    isAtSettingsClientTab,
    isAtSettingsNodeTab,
    isRemindToSetSheriffGooglePlay,
    isSettingsAtAddonsSheet,
    isSettingsAtSecuritySheet,
    isSettingsClientValuesToBeLoaded,
    isSettingsNodeMetaToBeLoaded,
    isSettingsNodeValuesToBeLoaded,
    isSettingsPluginsLoaded,
    isSettingsPluginsToBeLoaded,
    isSettingsTokensToBeLoaded
} from "state/settings/selectors";
import {
    SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE,
    SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN,
    SETTINGS_CHANGED_PASSWORD,
    SETTINGS_GO_TO_SHEET,
    SETTINGS_GO_TO_TAB,
    SETTINGS_TOKENS_CREATED,
    SETTINGS_TOKENS_DIALOG_CLOSE,
    SETTINGS_TOKENS_DIALOG_OPEN,
    SETTINGS_TOKENS_UPDATED,
    settingsChangePasswordDialogClose,
    settingsClientConflict,
    settingsClientValuesLoad,
    settingsClientValuesUnset,
    settingsNodeConflict,
    settingsNodeMetaLoad,
    settingsNodeMetaUnset,
    settingsNodeValuesLoad,
    settingsNodeValuesUnset,
    settingsPluginsConflict,
    settingsPluginsLoad,
    settingsPluginsUnset,
    settingsRemindSetSheriffGooglePlay,
    settingsTokensDialogClose,
    settingsTokensLoad,
    settingsTokensUnset
} from "state/settings/actions";
import { HOME_INTRODUCED } from "state/home/actions";
import { isConnectedToHome } from "state/home/selectors";
import { dialogClosed, dialogOpened, GO_TO_PAGE, newLocation, updateLocation, WAKE_UP } from "state/navigation/actions";
import {
    EVENT_HOME_CLIENT_SETTINGS_CHANGED,
    EVENT_HOME_NODE_SETTINGS_CHANGED,
    EVENT_HOME_NODE_SETTINGS_META_CHANGED,
    EVENT_HOME_PLUGINS_UPDATED
} from "api/events";
import { flashBox } from "state/flashbox/actions";
import { POST_INIT_DELAYED } from "state/pulse/actions";

export default [
    trigger(SETTINGS_GO_TO_TAB, isSettingsNodeValuesToBeLoaded, settingsNodeValuesLoad),
    trigger(SETTINGS_GO_TO_TAB, isSettingsNodeMetaToBeLoaded, settingsNodeMetaLoad),
    trigger([HOME_INTRODUCED, WAKE_UP], isConnectedToHome, settingsNodeValuesLoad),
    trigger([HOME_INTRODUCED, EVENT_HOME_NODE_SETTINGS_META_CHANGED], isConnectedToHome, settingsNodeMetaLoad),
    trigger([HOME_INTRODUCED, WAKE_UP], inv(isConnectedToHome), settingsNodeValuesUnset),
    trigger([HOME_INTRODUCED, WAKE_UP], inv(isConnectedToHome), settingsNodeMetaUnset),
    trigger(SETTINGS_GO_TO_TAB, isSettingsClientValuesToBeLoaded, settingsClientValuesLoad),
    trigger([HOME_INTRODUCED, WAKE_UP], isConnectedToHome, settingsClientValuesLoad),
    trigger([HOME_INTRODUCED, WAKE_UP], inv(isConnectedToHome), settingsClientValuesUnset),
    trigger(SETTINGS_GO_TO_TAB, true, newLocation),
    trigger(SETTINGS_GO_TO_SHEET, true, updateLocation),
    trigger(SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN, true, dialogOpened(settingsChangePasswordDialogClose())),
    trigger(SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE, true, dialogClosed),
    trigger(
        [HOME_INTRODUCED, GO_TO_PAGE, SETTINGS_GO_TO_SHEET],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtSecuritySheet, isSettingsTokensToBeLoaded),
        settingsTokensLoad
    ),
    trigger(HOME_INTRODUCED, inv(isConnectedToHome), settingsTokensUnset),
    trigger(
        [HOME_INTRODUCED, GO_TO_PAGE, SETTINGS_GO_TO_SHEET],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtAddonsSheet, isSettingsPluginsToBeLoaded),
        settingsPluginsLoad
    ),
    trigger(HOME_INTRODUCED, inv(isConnectedToHome), settingsPluginsUnset),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, true, settingsNodeValuesLoad),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeConflict),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, true, settingsClientValuesLoad),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsClientTab), settingsClientConflict),
    trigger(SETTINGS_CHANGED_PASSWORD, true, () => flashBox(i18n.t("password-changed"))),
    trigger(EVENT_HOME_PLUGINS_UPDATED, isSettingsPluginsLoaded, settingsPluginsLoad),
    trigger(
        EVENT_HOME_PLUGINS_UPDATED,
        conj(isAtSettingsPage, isAtSettingsNodeTab, isSettingsPluginsLoaded),
        settingsPluginsConflict
    ),
    trigger(SETTINGS_TOKENS_DIALOG_OPEN, true, dialogOpened(settingsTokensDialogClose())),
    trigger(SETTINGS_TOKENS_DIALOG_CLOSE, true, dialogClosed),
    trigger(SETTINGS_TOKENS_CREATED, true, dialogClosed),
    trigger(SETTINGS_TOKENS_UPDATED, true, dialogClosed),
    trigger(POST_INIT_DELAYED, isRemindToSetSheriffGooglePlay, settingsRemindSetSheriffGooglePlay)
];

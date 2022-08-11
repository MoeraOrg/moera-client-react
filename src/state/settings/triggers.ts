import { conj, inv, trigger } from "state/trigger";
import { isAtSettingsPage } from "state/navigation/selectors";
import {
    isAtSettingsClientTab,
    isAtSettingsNodeTab,
    isSettingsAtAddonsSheet,
    isSettingsClientValuesToBeLoaded,
    isSettingsNodeMetaToBeLoaded,
    isSettingsNodeValuesToBeLoaded,
    isSettingsTokensToBeLoaded
} from "state/settings/selectors";
import {
    SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE,
    SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN,
    SETTINGS_CHANGED_PASSWORD,
    SETTINGS_GO_TO_SHEET,
    SETTINGS_GO_TO_TAB,
    settingsChangePasswordDialogClose,
    settingsClientConflict,
    settingsClientValuesLoad,
    settingsClientValuesUnset,
    settingsNodeConflict,
    settingsNodeMetaLoad,
    settingsNodeMetaUnset,
    settingsNodeValuesLoad,
    settingsNodeValuesUnset,
    settingsTokensLoad,
    settingsTokensUnset
} from "state/settings/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { isConnectedToHome } from "state/home/selectors";
import { dialogClosed, dialogOpened, GO_TO_PAGE, newLocation, updateLocation, WAKE_UP } from "state/navigation/actions";
import {
    EVENT_HOME_CLIENT_SETTINGS_CHANGED,
    EVENT_HOME_NODE_SETTINGS_CHANGED,
    EVENT_HOME_NODE_SETTINGS_META_CHANGED
} from "api/events/actions";
import { flashBox } from "state/flashbox/actions";

export default [
    trigger(SETTINGS_GO_TO_TAB, isSettingsNodeValuesToBeLoaded, settingsNodeValuesLoad),
    trigger(SETTINGS_GO_TO_TAB, isSettingsNodeMetaToBeLoaded, settingsNodeMetaLoad),
    trigger([CONNECTED_TO_HOME, WAKE_UP], isConnectedToHome, settingsNodeValuesLoad),
    trigger([CONNECTED_TO_HOME, EVENT_HOME_NODE_SETTINGS_META_CHANGED], isConnectedToHome, settingsNodeMetaLoad),
    trigger([DISCONNECTED_FROM_HOME, WAKE_UP], inv(isConnectedToHome), settingsNodeValuesUnset),
    trigger([DISCONNECTED_FROM_HOME, WAKE_UP], inv(isConnectedToHome), settingsNodeMetaUnset),
    trigger(SETTINGS_GO_TO_TAB, isSettingsClientValuesToBeLoaded, settingsClientValuesLoad),
    trigger([CONNECTED_TO_HOME, WAKE_UP], isConnectedToHome, settingsClientValuesLoad),
    trigger([DISCONNECTED_FROM_HOME, WAKE_UP], inv(isConnectedToHome), settingsClientValuesUnset),
    trigger(SETTINGS_GO_TO_TAB, true, newLocation),
    trigger(SETTINGS_GO_TO_SHEET, true, updateLocation),
    trigger(SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN, true, dialogOpened(settingsChangePasswordDialogClose())),
    trigger(SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE, true, dialogClosed()),
    trigger(
        [CONNECTED_TO_HOME, GO_TO_PAGE, SETTINGS_GO_TO_SHEET],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtAddonsSheet, isSettingsTokensToBeLoaded),
        settingsTokensLoad
    ),
    trigger(DISCONNECTED_FROM_HOME, inv(isConnectedToHome), settingsTokensUnset),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, true, settingsNodeValuesLoad),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeConflict),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, true, settingsClientValuesLoad),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsClientTab), settingsClientConflict),
    trigger(SETTINGS_CHANGED_PASSWORD, true, flashBox("Password changed"))
];

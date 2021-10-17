import { conj, disj, inv, trigger } from "state/trigger";
import { isAtSettingsPage } from "state/navigation/selectors";
import {
    isAtSettingsClientTab,
    isAtSettingsNodeTab,
    isSettingsNodeMetaToBeLoaded,
    isSettingsNodeValuesToBeLoaded
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
    settingsNodeConflict,
    settingsNodeMetaLoad,
    settingsNodeMetaUnset,
    settingsNodeValuesLoad,
    settingsNodeValuesUnset
} from "state/settings/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { dialogClosed, dialogOpened, newLocation, updateLocation, WAKE_UP } from "state/navigation/actions";
import {
    EVENT_HOME_CLIENT_SETTINGS_CHANGED,
    EVENT_HOME_NODE_SETTINGS_CHANGED,
    EVENT_HOME_NODE_SETTINGS_META_CHANGED
} from "api/events/actions";
import { flashBox } from "state/flashbox/actions";

export default [
    trigger(
        SETTINGS_GO_TO_TAB,
        conj(isAtSettingsNodeTab, isSettingsNodeValuesToBeLoaded),
        settingsNodeValuesLoad
    ),
    trigger(
        SETTINGS_GO_TO_TAB,
        conj(isAtSettingsNodeTab, isSettingsNodeMetaToBeLoaded),
        settingsNodeMetaLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP],
        conj(isAtSettingsPage, isAtSettingsNodeTab),
        settingsNodeValuesLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, EVENT_HOME_NODE_SETTINGS_META_CHANGED],
        conj(isAtSettingsPage, isAtSettingsNodeTab),
        settingsNodeMetaLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP],
        disj(inv(isAtSettingsPage), conj(isAtSettingsPage, inv(isAtSettingsNodeTab))),
        settingsNodeValuesUnset
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, EVENT_HOME_NODE_SETTINGS_META_CHANGED],
        disj(inv(isAtSettingsPage), conj(isAtSettingsPage, inv(isAtSettingsNodeTab))),
        settingsNodeMetaUnset
    ),
    trigger(
        SETTINGS_GO_TO_TAB,
        true,
        settingsClientValuesLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP],
        true,
        settingsClientValuesLoad
    ),
    trigger(SETTINGS_GO_TO_TAB, true, newLocation),
    trigger(SETTINGS_GO_TO_SHEET, true, updateLocation),
    trigger(SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN, true, dialogOpened(settingsChangePasswordDialogClose())),
    trigger(SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE, true, dialogClosed()),
    trigger(
        EVENT_HOME_NODE_SETTINGS_CHANGED,
        disj(inv(isAtSettingsPage), conj(isAtSettingsPage, inv(isAtSettingsNodeTab))),
        settingsNodeValuesUnset
    ),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeValuesLoad),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeConflict),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, true, settingsClientValuesLoad),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsClientTab), settingsClientConflict),
    trigger(SETTINGS_CHANGED_PASSWORD, true, flashBox("Password changed"))
];

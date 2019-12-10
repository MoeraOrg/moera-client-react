import { conj, disj, inv, trigger } from "state/trigger";
import { isAtSettingsPage } from "state/navigation/selectors";
import {
    isAtSettingsClientTab,
    isAtSettingsNodeTab,
    isSettingsNodeMetaToBeLoaded,
    isSettingsNodeValuesToBeLoaded
} from "state/settings/selectors";
import {
    SETTINGS_GO_TO_SHEET,
    SETTINGS_GO_TO_TAB,
    settingsClientConflict,
    settingsClientValuesLoad,
    settingsNodeConflict,
    settingsNodeMetaLoad,
    settingsNodeMetaUnset,
    settingsNodeValuesLoad,
    settingsNodeValuesUnset
} from "state/settings/actions";
import { CONNECTED_TO_HOME, DISCONNECT_FROM_HOME } from "state/home/actions";
import { newLocation, updateLocation } from "state/navigation/actions";
import { EVENT_HOME_CLIENT_SETTINGS_CHANGED, EVENT_HOME_NODE_SETTINGS_CHANGED } from "api/events/actions";

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
        [CONNECTED_TO_HOME, DISCONNECT_FROM_HOME],
        conj(isAtSettingsPage, isAtSettingsNodeTab),
        settingsNodeValuesLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECT_FROM_HOME],
        conj(isAtSettingsPage, isAtSettingsNodeTab),
        settingsNodeMetaLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECT_FROM_HOME],
        disj(inv(isAtSettingsPage), conj(isAtSettingsPage, inv(isAtSettingsNodeTab))),
        settingsNodeValuesUnset
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECT_FROM_HOME],
        disj(inv(isAtSettingsPage), conj(isAtSettingsPage, inv(isAtSettingsNodeTab))),
        settingsNodeMetaUnset
    ),
    trigger(
        SETTINGS_GO_TO_TAB,
        true,
        settingsClientValuesLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECT_FROM_HOME],
        true,
        settingsClientValuesLoad
    ),
    trigger(SETTINGS_GO_TO_TAB, true, newLocation),
    trigger(SETTINGS_GO_TO_SHEET, true, updateLocation),
    trigger(
        EVENT_HOME_NODE_SETTINGS_CHANGED,
        disj(inv(isAtSettingsPage), conj(isAtSettingsPage, inv(isAtSettingsNodeTab))),
        settingsNodeValuesUnset
    ),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeValuesLoad),
    trigger(EVENT_HOME_NODE_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeConflict),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, true, settingsClientValuesLoad),
    trigger(EVENT_HOME_CLIENT_SETTINGS_CHANGED, conj(isAtSettingsPage, isAtSettingsClientTab), settingsClientConflict)
];

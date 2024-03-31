import i18n from 'i18next';

import { conj, disj, inv, trigger } from "state/trigger";
import { isAtRemovalPage, isAtSettingsPage } from "state/navigation/selectors";
import {
    isAtSettingsClientTab,
    isAtSettingsNodeTab,
    isRemindToSetSheriffGooglePlay,
    isSettingsAtAddonsSheet,
    isSettingsAtRemovalSheet,
    isSettingsAtSecuritySheet,
    isSettingsClientValuesToBeLoaded,
    isSettingsDeleteNodeRequestToBeLoaded,
    isSettingsNodeMetaToBeLoaded,
    isSettingsNodeValuesToBeLoaded,
    isSettingsPluginsLoaded,
    isSettingsPluginsToBeLoaded,
    isSettingsTokensToBeLoaded
} from "state/settings/selectors";
import {
    settingsClientConflict,
    settingsClientValuesLoad,
    settingsClientValuesUnset,
    settingsDeleteNodeRequestLoad,
    settingsDeleteNodeRequestUnset,
    settingsGoToTab,
    settingsNodeConflict,
    settingsNodeMetaLoad,
    settingsNodeMetaUnset,
    settingsNodeValuesLoad,
    settingsNodeValuesUnset,
    settingsPluginsConflict,
    settingsPluginsLoad,
    settingsPluginsUnset,
    settingsRemindSetSheriffGooglePlay,
    settingsTokensLoad,
    settingsTokensUnset
} from "state/settings/actions";
import { isConnectedToHome } from "state/home/selectors";
import { newLocation, updateLocation } from "state/navigation/actions";
import { flashBox } from "state/flashbox/actions";

export default [
    trigger("SETTINGS_GO_TO_TAB", conj(isConnectedToHome, isSettingsNodeValuesToBeLoaded), settingsNodeValuesLoad),
    trigger("SETTINGS_GO_TO_TAB", conj(isConnectedToHome, isSettingsNodeMetaToBeLoaded), settingsNodeMetaLoad),
    trigger(["HOME_READY", "WAKE_UP"], isConnectedToHome, settingsNodeValuesLoad),
    trigger(["HOME_READY", "EVENT_HOME_NODE_SETTINGS_META_CHANGED"], isConnectedToHome, settingsNodeMetaLoad),
    trigger(["HOME_READY", "WAKE_UP"], inv(isConnectedToHome), settingsNodeValuesUnset),
    trigger(["HOME_READY", "WAKE_UP"], inv(isConnectedToHome), settingsNodeMetaUnset),
    trigger("SETTINGS_GO_TO_TAB", conj(isConnectedToHome, isSettingsClientValuesToBeLoaded), settingsClientValuesLoad),
    trigger(["HOME_READY", "WAKE_UP"], isConnectedToHome, settingsClientValuesLoad),
    trigger(["HOME_READY", "WAKE_UP"], inv(isConnectedToHome), settingsClientValuesUnset),
    trigger(
        "HOME_READY",
        conj(isAtSettingsPage, isAtSettingsNodeTab, inv(isConnectedToHome)),
        settingsGoToTab("client")
    ),
    trigger("SETTINGS_GO_TO_TAB", true, newLocation),
    trigger("SETTINGS_GO_TO_SHEET", true, updateLocation),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtSecuritySheet, isSettingsTokensToBeLoaded),
        settingsTokensLoad
    ),
    trigger("HOME_READY", inv(isConnectedToHome), settingsTokensUnset),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtAddonsSheet, isSettingsPluginsToBeLoaded),
        settingsPluginsLoad
    ),
    trigger("HOME_READY", inv(isConnectedToHome), settingsPluginsUnset),
    trigger("EVENT_HOME_NODE_SETTINGS_CHANGED", true, settingsNodeValuesLoad),
    trigger("EVENT_HOME_NODE_SETTINGS_CHANGED", conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeConflict),
    trigger("EVENT_HOME_CLIENT_SETTINGS_CHANGED", true, settingsClientValuesLoad),
    trigger("EVENT_HOME_CLIENT_SETTINGS_CHANGED", conj(isAtSettingsPage, isAtSettingsClientTab), settingsClientConflict),
    trigger("SETTINGS_CHANGED_PASSWORD", true, () => flashBox(i18n.t("password-changed"))),
    trigger("EVENT_HOME_PLUGINS_UPDATED", isSettingsPluginsLoaded, settingsPluginsLoad),
    trigger(
        "EVENT_HOME_PLUGINS_UPDATED",
        conj(isAtSettingsPage, isAtSettingsNodeTab, isSettingsPluginsLoaded),
        settingsPluginsConflict
    ),
    trigger("POST_INIT_DELAYED", isRemindToSetSheriffGooglePlay, settingsRemindSetSheriffGooglePlay),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(
            isConnectedToHome,
            disj(conj(isAtSettingsPage, isSettingsAtRemovalSheet), isAtRemovalPage),
            isSettingsDeleteNodeRequestToBeLoaded
        ),
        settingsDeleteNodeRequestLoad
    ),
    trigger("HOME_READY", inv(isConnectedToHome), settingsDeleteNodeRequestUnset)
];

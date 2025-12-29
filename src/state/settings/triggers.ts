import { conj, disj, inv, trigger } from "state/trigger";
import { isAtRemovalPage, isAtSettingsPage } from "state/navigation/selectors";
import {
    isAtSettingsClientTab,
    isAtSettingsNodeTab,
    isSettingsAtAddonsSheet,
    isSettingsAtApplicationsSheet,
    isSettingsAtProfileSheet,
    isSettingsAtRemovalSheet,
    isSettingsClientValuesToBeLoaded,
    isSettingsDeleteNodeRequestToBeLoaded,
    isSettingsGrantsToBeLoaded,
    isSettingsNodeMetaToBeLoaded,
    isSettingsNodeValuesToBeLoaded,
    isSettingsPluginsLoaded,
    isSettingsPluginsToBeLoaded,
    isSettingsTokensToBeLoaded
} from "state/settings/selectors";
import {
    settingsClientConflict,
    settingsClientValuesLoad,
    settingsDeleteNodeRequestLoad,
    settingsGoToTab,
    settingsGrantsLoad,
    settingsMnemonicLoad,
    settingsNodeConflict,
    settingsNodeMetaLoad,
    settingsNodeValuesLoad,
    settingsPluginsConflict,
    settingsPluginsLoad,
    settingsTokensLoad
} from "state/settings/actions";
import { isConnectedToHome } from "state/home/selectors";
import { updateLocation } from "state/navigation/actions";
import { profileEditConflict, profileLoad } from "state/profile/actions";
import { isProfileLoaded, isProfileToBeLoaded } from "state/profile/selectors";

export default [
    trigger("SETTINGS_GO_TO_TAB", conj(isConnectedToHome, isSettingsNodeValuesToBeLoaded), settingsNodeValuesLoad),
    trigger("SETTINGS_GO_TO_TAB", conj(isConnectedToHome, isSettingsNodeMetaToBeLoaded), settingsNodeMetaLoad),
    trigger(["HOME_READY", "WAKE_UP"], isConnectedToHome, settingsNodeValuesLoad),
    trigger(["HOME_READY", "EVENT_HOME_NODE_SETTINGS_META_CHANGED"], isConnectedToHome, settingsNodeMetaLoad),
    trigger("SETTINGS_GO_TO_TAB", conj(isConnectedToHome, isSettingsClientValuesToBeLoaded), settingsClientValuesLoad),
    trigger(["HOME_READY", "WAKE_UP"], isConnectedToHome, settingsClientValuesLoad),
    trigger(
        "HOME_READY",
        conj(isAtSettingsPage, isAtSettingsNodeTab, inv(isConnectedToHome)),
        settingsGoToTab("client")
    ),
    trigger("SETTINGS_GO_TO_TAB", true, updateLocation),
    trigger("SETTINGS_GO_TO_SHEET", true, updateLocation),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtApplicationsSheet, isSettingsGrantsToBeLoaded),
        settingsGrantsLoad
    ),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtApplicationsSheet, isSettingsTokensToBeLoaded),
        settingsTokensLoad
    ),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtAddonsSheet, isSettingsPluginsToBeLoaded),
        settingsPluginsLoad
    ),
    trigger("EVENT_HOME_NODE_SETTINGS_CHANGED", true, settingsNodeValuesLoad),
    trigger("EVENT_HOME_NODE_SETTINGS_CHANGED", conj(isAtSettingsPage, isAtSettingsNodeTab), settingsNodeConflict),
    trigger("EVENT_HOME_CLIENT_SETTINGS_CHANGED", true, settingsClientValuesLoad),
    trigger("EVENT_HOME_CLIENT_SETTINGS_CHANGED", conj(isAtSettingsPage, isAtSettingsClientTab), settingsClientConflict),
    trigger("MNEMONIC_DIALOG_OPEN", true, settingsMnemonicLoad),
    trigger("EVENT_HOME_PLUGINS_UPDATED", isSettingsPluginsLoaded, settingsPluginsLoad),
    trigger(
        "EVENT_HOME_PLUGINS_UPDATED",
        conj(isAtSettingsPage, isAtSettingsNodeTab, isSettingsPluginsLoaded),
        settingsPluginsConflict
    ),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_SHEET"],
        conj(
            isConnectedToHome,
            disj(conj(isAtSettingsPage, isSettingsAtRemovalSheet), isAtRemovalPage),
            isSettingsDeleteNodeRequestToBeLoaded
        ),
        settingsDeleteNodeRequestLoad
    ),
    trigger(
        ["HOME_READY", "GO_TO_PAGE", "SETTINGS_GO_TO_TAB", "SETTINGS_GO_TO_SHEET"],
        conj(isConnectedToHome, isAtSettingsPage, isSettingsAtProfileSheet, isProfileToBeLoaded),
        profileLoad
    ),
    trigger("EVENT_NODE_PROFILE_UPDATED", conj(isAtSettingsPage, isSettingsAtProfileSheet), profileEditConflict),
    trigger(
        "EVENT_NODE_PROFILE_UPDATED",
        conj(isAtSettingsPage, inv(isSettingsAtProfileSheet), isProfileLoaded),
        profileLoad
    ),
];

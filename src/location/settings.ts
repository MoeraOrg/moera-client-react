import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToSettings } from "state/navigation/actions";
import { settingsGoToSheet, settingsGoToTab } from "state/settings/actions";
import { SettingsTabId } from "state/settings/state";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/names";

// Do not forget to update SettingsTabId
const SETTINGS_TABS: string[] = ["profile", "client", "node"];

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "settings") {
        actions.push(goToSettings());
    }
    const srcTab = srcInfo.directories.length > 1 && SETTINGS_TABS.includes(srcInfo.directories[1])
        ? srcInfo.directories[1]
        : "";
    const dstTab = dstInfo.directories.length > 1 && SETTINGS_TABS.includes(dstInfo.directories[1])
        ? dstInfo.directories[1] as SettingsTabId
        : "profile";
    if (srcTab !== dstTab) {
        actions.push(settingsGoToTab(dstTab));
    }
    if (srcInfo.hash !== dstInfo.hash) {
        actions.push(settingsGoToSheet(dstInfo.hash));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("settings").withTitle(i18n.t("settings") + atOwner(state)).withBackTitle(i18n.t("back-settings"));
    if (SETTINGS_TABS.includes(state.settings.tab)) {
        info = info.sub(state.settings.tab);
    }
    return info.noIndex().withHash(state.settings.sheet);
}

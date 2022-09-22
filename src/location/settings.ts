import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToSettings } from "state/navigation/actions";
import { settingsGoToSheet, settingsGoToTab } from "state/settings/actions";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/misc";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "settings") {
        actions.push(goToSettings());
    }
    const srcTab = srcInfo.directories.length > 1
        && (srcInfo.directories[1] === "client" || srcInfo.directories[1] === "node") ? srcInfo.directories[1] : "";
    const dstTab = dstInfo.directories.length > 1 && dstInfo.directories[1] === "client" ? "client" : "node";
    if (srcTab !== dstTab) {
        actions.push(settingsGoToTab(dstTab));
    }
    if (srcInfo.hash !== dstInfo.hash) {
        actions.push(settingsGoToSheet(dstInfo.hash));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("settings").withTitle(i18n.t("settings") + atOwner(state));
    if (state.settings.tab === "node") {
        info = info.sub("node");
    } else if (state.settings.tab === "client") {
        info = info.sub("client");
    }
    return info.withHash(state.settings.sheet);
}

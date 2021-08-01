import { SettingsTabId } from "state/settings/state";

const MENU_ITEMS: Record<SettingsTabId, Record<string, string>> = {
    "node": {
        "posting": "Post",
        "security": "Security",
        "other": "Other"
    },
    "client": {
        "posting": "Post",
        "comment": "Comment",
        "reactions": "Reactions",
        "other": "Other"
    }
};

export function getMenuItems(tab: SettingsTabId): Partial<Record<string, string>> {
    return MENU_ITEMS[tab];
}

export function getActualTab(tab: SettingsTabId): SettingsTabId {
    return MENU_ITEMS[tab] ? tab : "node";
}

export function getActualSheet(tab: SettingsTabId, sheet: string): string {
    const items = getMenuItems(getActualTab(tab));
    return items[sheet] ? sheet : Object.keys(items)[0];
}

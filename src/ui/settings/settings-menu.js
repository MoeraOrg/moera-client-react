const MENU_ITEMS = {
    "node": {
        "posting": "Post",
        "other": "Other"
    },
    "client": {
        "posting": "Post",
        "comment": "Comment",
        "reactions": "Reactions",
        "other": "Other"
    }
};

export function getMenuItems(tab) {
    return MENU_ITEMS[tab];
}

export function getActualTab(tab) {
    return MENU_ITEMS[tab] ? tab : "node";
}

export function getActualSheet(tab, sheet) {
    const items = getMenuItems(getActualTab(tab));
    return items[sheet] ? sheet : Object.keys(items)[0];
}

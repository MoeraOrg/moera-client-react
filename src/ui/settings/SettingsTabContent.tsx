import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { SettingsTabId } from "state/settings/state";
import {
    component,
    getActualSheetName,
    getOtherOptions,
    getPluginsItems,
    getSheet,
    Item
} from "ui/settings/settings-menu";
import SettingsSheet from "ui/settings/SettingsSheet";
import SettingsItemAddonsEmpty from "ui/settings/SettingsItemAddonsEmpty";
import SettingsPluginControls from "ui/settings/SettingsPluginControls";
import SettingsModerationSheet from "ui/settings/SettingsModerationSheet";
import SettingsRemovalSheet from "ui/settings/SettingsRemovalSheet";

interface Props {
    tab: SettingsTabId;
}

export default function SettingsTabContent({tab}: Props) {
    const sheet = useSelector((state: ClientState) => getSheet(tab, getActualSheetName(tab, state.settings.sheet)));
    const otherItems = useSelector((state: ClientState) => getOtherItems(state, tab));
    const addonsItems = useSelector(getAddonsItems);
    const clientValues = useSelector((state: ClientState) =>
        tab === "node" ? state.settings.node.values : state.settings.client.values
    );
    const clientMeta = useSelector((state: ClientState) =>
        tab === "node" ? state.settings.node.meta : state.settings.client.meta
    );

    if (sheet == null) {
        return null;
    }

    let items: Item[];
    switch (sheet.name) {
        case "other":
            items = otherItems;
            break;
        case "addons":
            items = addonsItems;
            break;
        case "moderation":
            return <SettingsModerationSheet valuesMap={clientValues}/>;
        case "removal":
            return <SettingsRemovalSheet/>;
        default:
            items = sheet.children;
            break;
    }

    return <SettingsSheet items={items} valuesMap={clientValues} metaMap={clientMeta}/>;
}

const getOtherItems = createSelector(
    (state: ClientState, tab: SettingsTabId) => tab,
    (state: ClientState, tab: SettingsTabId) => tab === "node" ? state.settings.node.meta : state.settings.client.meta,
    (tab, meta) => getOtherOptions(tab, meta.keys())
);

const getAddonsItems = createSelector(
    (state: ClientState) => state.settings.plugins.plugins,
    plugins => plugins != null && plugins.length > 0
        ? getPluginsItems(plugins, SettingsPluginControls)
        : [component(SettingsItemAddonsEmpty)]
);

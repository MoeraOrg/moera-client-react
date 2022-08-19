import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
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

interface OwnProps {
    tab: SettingsTabId;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SettingsTabContent({sheet, otherItems, addonsItems, clientValues, clientMeta}: Props) {
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

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        sheet: getSheet(ownProps.tab, getActualSheetName(ownProps.tab, state.settings.sheet)),
        otherItems: getOtherItems(state, ownProps.tab),
        addonsItems: getAddonsItems(state),
        clientValues: ownProps.tab === "node" ? state.settings.node.values : state.settings.client.values,
        clientMeta: ownProps.tab === "node" ? state.settings.node.meta : state.settings.client.meta
    })
);

export default connector(SettingsTabContent);

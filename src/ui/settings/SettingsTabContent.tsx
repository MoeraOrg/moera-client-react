import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { SettingsTabId } from "state/settings/state";
import { getActualSheetName, getOtherOptions, getSheet } from "ui/settings/settings-menu";
import SettingsSheet from "ui/settings/SettingsSheet";

interface OwnProps {
    tab: SettingsTabId;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SettingsTabContent({sheet, otherItems, clientValues, clientMeta}: Props) {
    if (sheet == null) {
        return null;
    }

    const items = sheet.name !== "other" ? sheet.children : otherItems;
    return <SettingsSheet items={items} valuesMap={clientValues} metaMap={clientMeta}/>;
}

const getOtherItems = createSelector(
    (state: ClientState, tab: SettingsTabId) => tab,
    (state: ClientState, tab: SettingsTabId) => tab === "node" ? state.settings.node.meta : state.settings.client.meta,
    (tab, meta) => getOtherOptions(tab, meta.keys())
);

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        sheet: getSheet(ownProps.tab, getActualSheetName(ownProps.tab, state.settings.sheet)),
        otherItems: getOtherItems(state, ownProps.tab),
        clientValues: ownProps.tab === "node" ? state.settings.node.values : state.settings.client.values,
        clientMeta: ownProps.tab === "node" ? state.settings.node.meta : state.settings.client.meta
    })
);

export default connector(SettingsTabContent);

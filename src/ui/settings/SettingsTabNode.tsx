import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getActualSheet } from "ui/settings/settings-menu";
import SettingsSheetNodePosting from "ui/settings/SettingsSheetNodePosting";
import SettingsSheetNodeSecurity from "ui/settings/SettingsSheetNodeSecurity";
import SettingsSheetNodeOther from "ui/settings/SettingsSheetNodeOther";

type Props = ConnectedProps<typeof connector>;

function SettingsTabNode({sheet}: Props) {
    switch (sheet) {
        case "posting":
            return <SettingsSheetNodePosting/>;
        case "security":
            return <SettingsSheetNodeSecurity/>;
        default:
            return <SettingsSheetNodeOther/>;
    }
}

const connector = connect(
    (state: ClientState) => ({
        sheet: getActualSheet("node", state.settings.sheet)
    })
);

export default connector(SettingsTabNode);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getActualSheet } from "ui/settings/settings-menu";
import SettingsSheetClientOther from "ui/settings/SettingsSheetClientOther";
import SettingsSheetClientPosting from "ui/settings/SettingsSheetClientPosting";
import SettingsSheetClientReactions from "ui/settings/SettingsSheetClientReactions";
import SettingsSheetClientComment from "ui/settings/SettingsSheetClientComment";

type Props = ConnectedProps<typeof connector>;

function SettingsTabClient ({sheet}: Props) {
    switch (sheet) {
        case "posting":
            return <SettingsSheetClientPosting/>;
        case "comment":
            return <SettingsSheetClientComment/>;
        case "reactions":
            return <SettingsSheetClientReactions/>;
        default:
            return <SettingsSheetClientOther/>;
    }
}

const connector = connect(
    (state: ClientState) => ({
        sheet: getActualSheet("client", state.settings.sheet)
    })
);

export default connector(SettingsTabClient);

import React from 'react';
import { connect } from 'react-redux';

import SettingsSheetClientOther from "ui/settings/SettingsSheetClientOther";
import SettingsSheetClientPosting from "ui/settings/SettingsSheetClientPosting";
import SettingsSheetClientReactions from "ui/settings/SettingsSheetClientReactions";

const SettingsTabClient = ({sheet}) => {
    switch (sheet) {
        case "posting":
            return <SettingsSheetClientPosting/>;
        case "reactions":
            return <SettingsSheetClientReactions/>;
        default:
            return <SettingsSheetClientOther/>;
    }
};

export default connect(
    state => ({
        sheet: state.settings.sheet
    })
)(SettingsTabClient);

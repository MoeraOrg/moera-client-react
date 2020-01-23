import React from 'react';
import { connect } from 'react-redux';

import SettingsSheetClientOther from "ui/settings/SettingsSheetClientOther";

const SettingsTabClient = ({sheet}) => {
    switch (sheet) {
        default:
            return <SettingsSheetClientOther/>;
    }
};

export default connect(
    state => ({
        sheet: state.settings.sheet
    })
)(SettingsTabClient);

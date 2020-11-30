import React from 'react';
import { connect } from 'react-redux';

import { getActualSheet } from "ui/settings/settings-menu";
import SettingsSheetNodeOther from "ui/settings/SettingsSheetNodeOther";
import SettingsSheetNodePosting from "ui/settings/SettingsSheetNodePosting";

const SettingsTabNode = ({sheet}) => {
    switch (sheet) {
        case "posting":
            return <SettingsSheetNodePosting/>;
        default:
            return <SettingsSheetNodeOther/>;
    }
};

export default connect(
    state => ({
        sheet: getActualSheet("node", state.settings.sheet)
    })
)(SettingsTabNode);

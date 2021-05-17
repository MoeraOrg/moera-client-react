import React from 'react';
import { connect } from 'react-redux';

import { getActualSheet } from "ui/settings/settings-menu";
import SettingsSheetNodePosting from "ui/settings/SettingsSheetNodePosting";
import SettingsSheetNodeSecurity from "ui/settings/SettingsSheetNodeSecurity";
import SettingsSheetNodeOther from "ui/settings/SettingsSheetNodeOther";

function SettingsTabNode({sheet}) {
    switch (sheet) {
        case "posting":
            return <SettingsSheetNodePosting/>;
        case "security":
            return <SettingsSheetNodeSecurity/>;
        default:
            return <SettingsSheetNodeOther/>;
    }
}

export default connect(
    state => ({
        sheet: getActualSheet("node", state.settings.sheet)
    })
)(SettingsTabNode);

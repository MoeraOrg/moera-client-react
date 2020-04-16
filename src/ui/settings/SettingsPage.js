import React from 'react';
import { connect } from 'react-redux';

import { Page } from "ui/page/Page";
import SettingsConflicts from "ui/settings/SettingsConflicts";
import SettingsTabs from "ui/settings/SettingsTabs";
import SettingsMenu from "ui/settings/SettingsMenu";
import SettingsTabNode from "ui/settings/SettingsTabNode";
import SettingsTabClient from "ui/settings/SettingsTabClient";
import "./SettingsPage.css";

const SettingsPage = ({tab}) => (
    <Page className="mt-3">
        <h2>Your Settings</h2>
        <br/>

        <SettingsConflicts/>
        <SettingsTabs/>
        <div className="row settings-notebook">
            <SettingsMenu/>
            <div className="col-md-10">
                {tab === "node" && <SettingsTabNode/>}
                {tab === "client" && <SettingsTabClient/>}
            </div>
        </div>
    </Page>
);

export default connect(
    state => ({
        tab: state.settings.tab,
        nodeConflict: state.settings.node.conflict,
        clientConflict: state.settings.client.conflict
    })
)(SettingsPage);

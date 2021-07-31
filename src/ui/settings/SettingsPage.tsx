import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import SettingsConflicts from "ui/settings/SettingsConflicts";
import SettingsTabs from "ui/settings/SettingsTabs";
import SettingsMenu from "ui/settings/SettingsMenu";
import SettingsTabNode from "ui/settings/SettingsTabNode";
import SettingsTabClient from "ui/settings/SettingsTabClient";
import "./SettingsPage.css";

type Props = ConnectedProps<typeof connector>;

const SettingsPage = ({tab}: Props) => (
    <>
        <PageHeader>
            <h2>Your Settings</h2>
        </PageHeader>
        <Page>
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
    </>
);

const connector = connect(
    (state: ClientState) => ({
        tab: state.settings.tab
    })
);

export default connector(SettingsPage);

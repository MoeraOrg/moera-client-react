import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import SettingsTab from "ui/settings/SettingsTab";
import "./SettingsTabs.css";

type Props = ConnectedProps<typeof connector>;

const SettingsTabs = ({loadingNodeValues, loadingNodeMeta, loadingClientValues}: Props) => {
    const {t} = useTranslation();

    return (
        <ul className="nav nav-tabs settings-tabs">
            <SettingsTab name="node" title={t("my-node")} href={"/settings/node"}
                         loading={loadingNodeValues || loadingNodeMeta}/>
            <SettingsTab name="client" title={t("my-client")} href={"/settings/client"}
                         loading={loadingClientValues}/>
        </ul>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loadingNodeValues: state.settings.node.loadingValues,
        loadingNodeMeta: state.settings.node.loadingMeta,
        loadingClientValues: state.settings.client.loadingValues
    })
);

export default connector(SettingsTabs);

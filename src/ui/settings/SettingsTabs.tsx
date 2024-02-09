import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import SettingsTab from "ui/settings/SettingsTab";
import "./SettingsTabs.css";
import { isConnectedToHome } from "state/home/selectors";

export default function SettingsTabs() {
    const connectedToHome = useSelector(isConnectedToHome);
    const loadingNodeValues = useSelector((state: ClientState) => state.settings.node.loadingValues);
    const loadingNodeMeta = useSelector((state: ClientState) => state.settings.node.loadingMeta);
    const loadingClientValues = useSelector((state: ClientState) => state.settings.client.loadingValues);
    const {t} = useTranslation();

    return (
        <ul className="nav nav-tabs settings-tabs">
            <SettingsTab name="client" title={t("my-client")} href={"/settings/client"}
                         loading={loadingClientValues}/>
            {connectedToHome &&
                <SettingsTab name="node" title={t("my-node")} href={"/settings/node"}
                             loading={loadingNodeValues || loadingNodeMeta}/>
            }
        </ul>
    );
}

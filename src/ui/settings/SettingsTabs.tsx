import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { SettingsTabId } from "state/settings/state";
import { Tabs } from "ui/control";
import "./SettingsTabs.css";

export default function SettingsTabs() {
    const connectedToHome = useSelector(isConnectedToHome);
    const loadingNodeValues = useSelector((state: ClientState) => state.settings.node.loadingValues);
    const loadingNodeMeta = useSelector((state: ClientState) => state.settings.node.loadingMeta);
    const loadingClientValues = useSelector((state: ClientState) => state.settings.client.loadingValues);
    const tab = useSelector((state: ClientState) => state.settings.tab);
    const {t} = useTranslation();

    return (
        <Tabs<SettingsTabId> tabs={[
            {
                title: t("my-client"),
                value: "client",
                href: "/settings/client",
                loading: loadingClientValues
            },
            {
                title: t("my-node"),
                value: "node",
                href: "/settings/node",
                visible: connectedToHome,
                loading: loadingNodeValues || loadingNodeMeta
            }
        ]} value={tab} className="settings-tabs" scroll="never"/>
    );
}

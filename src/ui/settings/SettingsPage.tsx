import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import SettingsConflicts from "ui/settings/SettingsConflicts";
import SettingsTabs from "ui/settings/SettingsTabs";
import SettingsMenu from "ui/settings/SettingsMenu";
import SettingsTabContent from "ui/settings/SettingsTabContent";
import "./SettingsPage.css";

export default function SettingsPage() {
    const connectedToHome = useSelector(isConnectedToHome);
    const tab = useSelector((state: ClientState) => state.settings.tab);
    const {t} = useTranslation();

    const visible = connectedToHome || tab !== "node";

    return (
        <>
            <PageHeader>
                <h2>{t("your-settings")}</h2>
            </PageHeader>
            <Page>
                <SettingsConflicts/>
                <SettingsTabs/>
                <div className="row settings-notebook">
                    {visible &&
                        <>
                            <SettingsMenu/>
                            <div className="col-md-10">
                                <SettingsTabContent tab={tab}/>
                            </div>
                        </>
                    }
                </div>
            </Page>
        </>
    );
}

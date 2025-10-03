import React from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from "ui/page/Page";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import SettingsRemovalSheet from "ui/settings/SettingsRemovalSheet";
import "./RemovalPage.css";

export default function RemovalPage() {
    const {t} = useTranslation();

    return (
        <>
            <DesktopMainMenu/>
            <MobileMainMenu/>
            <Page className="removal-page">
                <main className="page-central-pane content-panel">
                    <div className="page-title mb-3">{t("delete-account-moera")}</div>
                    <SettingsRemovalSheet/>
                </main>
            </Page>
            <BottomMenu/>
        </>
    );
}

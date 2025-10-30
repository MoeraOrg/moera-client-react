import React from 'react';
import { useTranslation } from 'react-i18next';

import GlobalTitle from "ui/mainmenu/GlobalTitle";
import SettingsRemovalSheet from "ui/settings/SettingsRemovalSheet";

export default function RemovalPage() {
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <main className="removal-page global-page">
                <div className="page-title mb-3">{t("delete-account-moera")}</div>
                <SettingsRemovalSheet/>
            </main>
        </>
    );
}

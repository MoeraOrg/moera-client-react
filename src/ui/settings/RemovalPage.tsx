import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import SettingsRemovalSheet from "ui/settings/SettingsRemovalSheet";

export default function RemovalPage() {
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>{t("delete-account-moera")}</h2>
            </PageHeader>
            <Page>
                <div className="central-pane row content-panel">
                    <SettingsRemovalSheet/>
                </div>
            </Page>
        </>
    );
}

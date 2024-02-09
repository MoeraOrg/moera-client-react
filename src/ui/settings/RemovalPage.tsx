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
                <h2>{t("delete-blog")}</h2>
            </PageHeader>
            <Page>
                <div className="row content-panel">
                    <SettingsRemovalSheet/>
                </div>
            </Page>
        </>
    );
}

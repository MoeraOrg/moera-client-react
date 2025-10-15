import React from 'react';
import { useTranslation } from 'react-i18next';

import GlobalTitle from "ui/mainmenu/GlobalTitle";
import { Page } from "ui/page/Page";
import GrantContent from "ui/grant/GrantContent";
import "./GrantPage.css";

export default function GrantPage() {
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <Page className="grant-page">
                <main className="page-central-pane content-panel">
                    <div className="page-title mb-3">{t("grant-access")}</div>
                    <GrantContent/>
                </main>
            </Page>
        </>
    );
}

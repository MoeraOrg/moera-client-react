import React from 'react';
import { useTranslation } from 'react-i18next';

import { OnlyDesktop, OnlyMobile } from "ui/control";
import { LogoImage } from "ui/mainmenu/logo/Logo";
import { Page } from "ui/page/Page";
import GrantContent from "ui/grant/GrantContent";
import "./GrantPage.css";

export default function GrantPage() {
    const {t} = useTranslation();

    return (
        <>
            <OnlyDesktop><LogoImage width="4.6rem" className="mt-4 ms-5 mb-3"/></OnlyDesktop>
            <Page className="grant-page">
                <main className="page-central-pane content-panel">
                    <OnlyMobile><LogoImage width="4.6rem" className="mt-2 mb-3"/></OnlyMobile>
                    <div className="page-title mb-3">{t("grant-access")}</div>
                    <GrantContent/>
                </main>
            </Page>
        </>
    );
}

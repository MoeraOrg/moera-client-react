import React from 'react';
import { useTranslation } from 'react-i18next';

import { LogoImage } from "ui/mainmenu/logo/Logo";
import { Page } from "ui/page/Page";
import GrantContent from "ui/grant/GrantContent";
import "./GrantPage.css";

export default function GrantPage() {
    const {t} = useTranslation();


    return (
        <>
            <LogoImage width="4.6rem" className="mt-4 ms-5 mb-3 d-none d-md-block"/>
            <Page className="grant-page">
                <div className="page-central-pane content-panel">
                    <LogoImage width="4.6rem" className="mt-2 mb-3 d-md-none"/>
                    <div className="page-title mb-3">{t("grant-access")}</div>
                    <GrantContent/>
                </div>
            </Page>
        </>
    );
}

import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import GrantContent from "ui/grant/GrantContent";
import "./GrantPage.css";

export default function GrantPage() {
    const {t} = useTranslation();


    return (
        <>
            <PageHeader>
                <h2>{t("grant-access")}</h2>
            </PageHeader>
            <Page>
                <div className="row content-panel grant-page">
                    <GrantContent/>
                </div>
            </Page>
        </>
    );
}

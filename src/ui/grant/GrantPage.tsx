import React from 'react';
import { useTranslation } from 'react-i18next';

import GlobalTitle from "ui/mainmenu/GlobalTitle";
import GrantContent from "ui/grant/GrantContent";
import "./GrantPage.css";

export default function GrantPage() {
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <main className="grant-page global-page">
                <div className="title">{t("grant-access")}</div>
                <GrantContent/>
            </main>
        </>
    );
}

import React from 'react';
import { useTranslation } from 'react-i18next';

import GlobalTitle from "ui/mainmenu/GlobalTitle";
import GlobalBottom from "ui/mainmenu/GlobalBottom";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";
import "./VerifyEmailPage.css";

export default function VerifyEmailPage() {
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <main className="verify-email-page global-page">
                <div className="title">{t("confirm-your-email-address")}</div>
                <p>{t("you-will-receive-confirm-email")}</p>
                <p>{t("if-not-received-check-spam")}</p>
                <Jump nodeName={REL_HOME} href="/start-reading" className="btn btn-primary submit-button">
                    {t("continue")}
                </Jump>
            </main>
            <GlobalBottom/>
        </>
    );
}

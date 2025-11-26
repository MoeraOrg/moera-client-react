import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isProfileLoaded } from "state/profile/selectors";
import { Loading } from "ui/control";
import { Icon, msCancel, msCheckCircle } from "ui/material-symbols";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import GlobalBottom from "ui/mainmenu/GlobalBottom";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";
import "./EmailVerifiedPage.css";

export default function EmailVerifiedPage() {
    const loaded = useSelector(isProfileLoaded);
    const profile = useSelector((state: ClientState) => state.profile.profile);
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <main className="email-verified-page global-page">
                <div className="title">{t("email-address-confirmation")}</div>
                {loaded ?
                    (profile.emailVerified ?
                        <div className="status succeeded">
                            <Icon icon={msCheckCircle} size="1.2em"/>
                            {t("your-email-address-confirmed")}
                        </div>
                    :
                        <div className="status failed">
                            <Icon icon={msCancel} size="1.2em"/>
                            {t("confirmation-token-incorrect-expired")}
                        </div>
                    )
                :
                    <div><Loading/></div>
                }
                <Jump nodeName={REL_HOME} href={profile.emailVerified ? "/news" : "/timeline"}
                      className="btn btn-primary submit-button">
                    {t("continue")}
                </Jump>
            </main>
            <GlobalBottom/>
        </>
    );
}

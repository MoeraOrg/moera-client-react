import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import * as Browser from "ui/browser";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import GlobalBottom from "ui/mainmenu/GlobalBottom";
import Jump from "ui/navigation/Jump";
import WelcomeSearchBox from "ui/welcome/WelcomeSearchBox";
import { REL_SEARCH } from "util/rel-node-name";
import "./WelcomePage.css";

export default function WelcomePage() {
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <main className="welcome global-page">
                <div className="title">{tTitle(t("welcome"))}</div>
                <WelcomeSearchBox/>
                <div className="or-line">
                    <hr/>
                    <div className="or">
                        {t("or")}
                    </div>
                    <hr/>
                </div>
                <Jump className="btn btn-outline-primary btn-lg more-button" nodeName={REL_SEARCH}
                      href="/explore/people">
                    {tTitle(t("find-more-people"))}
                </Jump>
                <Jump className="btn btn-primary btn-lg signup-button" href={Browser.urlWithBackHref("/signup")}>
                    {tTitle(t("create-account-submit"))}
                </Jump>
                <div className="link mt-3">
                    {t("already-have-account")}{" "}
                    <Jump className="btn btn-link" href={Browser.urlWithBackHref("/connect")}>
                        {t("connect")}
                    </Jump>
                </div>
            </main>
            <GlobalBottom/>
        </>
    );
}

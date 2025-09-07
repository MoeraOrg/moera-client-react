import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import MobileBack from "ui/page/MobileBack";
import { ReactComponent as GooglePlayProhibited } from "ui/page/GooglePlayProhibited.isvg";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { REL_HOME } from "util/rel-node-name";
import "./GooglePlayProhibitedPage.css";

export default function GooglePlayProhibitedPage() {
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <>
            <Page className="google-play-prohibited-page">
                <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                    {tTitle(t("not-accessible"))}
                </MobileBack>
                <div className="page-central-pane">
                    <DesktopBack nodeName={REL_HOME} href={newsHref}>
                        {t("back-news")}
                    </DesktopBack>
                    <div className="content-panel">
                        <GooglePlayProhibited/>
                        <div className="caption">{tTitle(t("not-accessible"))}</div>
                        <div className="instructions">{t("content-not-accessible-android")}</div>
                    </div>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}

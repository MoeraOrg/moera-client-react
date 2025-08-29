import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { getFeedBackTitle } from "ui/feed/feeds";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import MobileBack from "ui/page/MobileBack";
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
                        {getFeedBackTitle("news", t)}
                    </DesktopBack>
                    <div className="content-panel text-center">
                        {t("content-not-accessible-android")}
                    </div>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}

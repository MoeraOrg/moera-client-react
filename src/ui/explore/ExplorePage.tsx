import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isAtExplorePage } from "state/navigation/selectors";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import ExploreTabs from "ui/explore/ExploreTabs";
import BottomMenu from "ui/mainmenu/BottomMenu";
import FeedPage from "ui/feed/FeedPage";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./ExplorePage.css";

export default function ExplorePage() {
    const visible = useSelector(isAtExplorePage);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <>
            <Page className="explore-page tabbed-page">
                <div className="page-central-pane">
                    <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                        {t("explore")}
                    </MobileBack>
                    <BackBox>
                        <BackBoxInner>
                            <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                {t("back-news")}
                            </DesktopBack>
                            <ExploreTabs value="posts"/>
                        </BackBoxInner>
                    </BackBox>
                    <FeedPage
                        nodeName={REL_CURRENT}
                        feedName="explore"
                        visible={visible}
                        recommendations
                    />
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

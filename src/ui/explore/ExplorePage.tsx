import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { isAtExplorePage } from "state/navigation/selectors";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MobileBack from "ui/page/MobileBack";
import ExploreTabs from "ui/explore/ExploreTabs";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { useHomeNews } from "ui/feed/feeds";
import FeedPage from "ui/feed/FeedPage";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./ExplorePage.css";

export default function ExplorePage() {
    const visible = useSelector(isAtExplorePage);
    const newsHref = useHomeNews();
    const {t} = useTranslation();

    return (
        <>
            <Page className="explore-page tabbed-page">
                <div className="page-left-pane">
                    <MainMenuSidebar selected="explore"/>
                </div>
                <div className="page-central-pane">
                    <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                        {tTitle(t("explore-posts"))}
                    </MobileBack>
                    <BackBox>
                        <BackBoxInner>
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

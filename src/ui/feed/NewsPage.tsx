import React from 'react';
import { useSelector } from 'react-redux';

import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ExploreBox from "ui/explore/ExploreBox";
import { Page } from "ui/page/Page";
import { REL_CURRENT } from "util/rel-node-name";
import "./NewsPage.css";

export default function NewsPage() {
    const visible = useSelector(isAtNewsPage);

    return (
        <>
            <DesktopMainMenu transparent/>
            <MobileMainMenu shadow/>
            <Page className="news-page">
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <main className="page-central-pane">
                    <FeedPage
                        nodeName={REL_CURRENT}
                        feedName="news"
                        visible={visible}
                    />
                </main>
                <div className="page-right-pane">
                    <ExploreBox/>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}

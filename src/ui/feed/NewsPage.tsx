import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNewsPage } from "state/navigation/selectors";
import { getSetting } from "state/settings/selectors";
import { OnlyDesktop } from "ui/control";
import FeedPage from "ui/feed/FeedPage";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ExploreBox from "ui/explore/ExploreBox";
import { Page } from "ui/page/Page";
import { REL_CURRENT } from "util/rel-node-name";
import "./NewsPage.css";

export default function NewsPage() {
    const visible = useSelector(isAtNewsPage);
    const showExplore = useSelector((state: ClientState) => getSetting(state, "explore.news.show"));

    return (
        <>
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
                <OnlyDesktop>
                    <div className="page-right-pane">
                        {showExplore && <ExploreBox/>}
                    </div>
                </OnlyDesktop>
            </Page>
            <BottomMenu/>
        </>
    );
}

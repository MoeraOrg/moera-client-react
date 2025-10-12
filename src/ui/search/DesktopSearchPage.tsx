import React from 'react';

import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import SearchTabs from "ui/search/SearchTabs";
import SearchFeed from "ui/search/SearchFeed";

const DesktopSearchPage = () => (
    <>
        <DesktopMainMenu/>
        <Page className="search-page tabbed-page">
            <div className="page-left-pane">
                <MainMenuSidebar/>
            </div>
            <main className="page-central-pane">
                <BackBox>
                    <BackBoxInner>
                        <SearchTabs/>
                    </BackBoxInner>
                </BackBox>
                <SearchFeed/>
            </main>
        </Page>
    </>
);

export default DesktopSearchPage;

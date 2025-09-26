import React from 'react';

import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import SearchTabs from "ui/search/SearchTabs";
import SearchFeed from "ui/search/SearchFeed";

const DesktopSearchPage = () => (
    <Page className="search-page tabbed-page">
        <div className="page-left-pane">
            <MainMenuSidebar/>
        </div>
        <div className="page-central-pane">
            <BackBox>
                <BackBoxInner>
                    <SearchTabs/>
                </BackBoxInner>
            </BackBox>
            <SearchFeed/>
        </div>
    </Page>
);

export default DesktopSearchPage;

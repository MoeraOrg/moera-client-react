import React from 'react';

import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import SearchTabs from "ui/search/SearchTabs";
import SearchFeed from "ui/search/SearchFeed";

export default function MobileSearchPage() {
    return (
        <>
            <MobileMainMenu shadow/>
            <Page className="search-page tabbed-page">
                <div className="page-central-pane">
                    <BackBox>
                        <BackBoxInner>
                            <SearchTabs/>
                        </BackBoxInner>
                    </BackBox>
                    <SearchFeed/>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}

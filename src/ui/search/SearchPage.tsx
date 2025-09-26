import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import SearchTabs from "ui/search/SearchTabs";
import SearchFeed from "ui/search/SearchFeed";
import SearchFilterDialog from "ui/search/SearchFilterDialog";
import "./SearchPage.css";

export default function SearchPage() {
    const showFilters = useSelector((state: ClientState) => state.search.showFilters);

    return (
        <>
            <MobileMainMenu shadow/>
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
                {showFilters && <SearchFilterDialog/>}
            </Page>
            <BottomMenu/>
        </>
    );
}

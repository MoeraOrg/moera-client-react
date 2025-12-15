import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { Loading } from "ui/control";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ExploreTabs from "ui/explore/ExploreTabs";
import TrendingPost from "ui/explore/TrendingPost";

export default function TrendingPage() {
    const loading = useSelector((state: ClientState) => state.explore.loadingTrending);
    const posts = useSelector((state: ClientState) => state.explore.trending);

    return (
        <>
            <DesktopMainMenu/>
            <Page className="trending-page explore-page tabbed-page">
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <div className="page-central-pane">
                    <MobileMainMenu/>
                    <BackBox>
                        <BackBoxInner>
                            <ExploreTabs value="trending"/>
                        </BackBoxInner>
                    </BackBox>
                    <main className="content-panel">
                        {posts.map((post, index) =>
                            <TrendingPost trending={post} counters={["reactions", "comments"]} key={index}/>
                        )}
                        {loading && <Loading/>}
                    </main>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

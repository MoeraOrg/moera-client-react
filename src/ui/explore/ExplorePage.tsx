import React from 'react';
import { useSelector } from 'react-redux';

import { isAtExplorePage } from "state/navigation/selectors";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import ExploreTabs from "ui/explore/ExploreTabs";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import FeedPage from "ui/feed/FeedPage";
import { REL_CURRENT } from "util/rel-node-name";
import "./ExplorePage.css";

export default function ExplorePage() {
    const visible = useSelector(isAtExplorePage);

    return (
        <>
            <Page className="explore-page tabbed-page">
                <div className="page-left-pane">
                    <MainMenuSidebar selected="explore"/>
                </div>
                <main className="page-central-pane">
                    <MobileMainMenu/>
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
                </main>
            </Page>
            <BottomMenu/>
        </>
    );
};

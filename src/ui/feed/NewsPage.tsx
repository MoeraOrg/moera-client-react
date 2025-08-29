import React from 'react';
import { useSelector } from 'react-redux';

import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import { REL_CURRENT } from "util/rel-node-name";
import "./NewsPage.css";

export default function NewsPage() {
    const visible = useSelector(isAtNewsPage);

    return (
        <>
            <MobileMainMenu/>
            <Page className="news-page">
                <div className="page-central-pane">
                    <FeedPage
                        nodeName={REL_CURRENT}
                        feedName="news"
                        visible={visible}
                    />
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}

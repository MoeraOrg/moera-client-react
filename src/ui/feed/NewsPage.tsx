import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import { getFeedTitle } from "ui/feed/feeds";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import { REL_CURRENT } from "util/rel-node-name";
import "./NewsPage.css";

export default function NewsPage() {
    const visible = useSelector(isAtNewsPage);
    const {t} = useTranslation();

    return (
        <>
            <MobileMainMenu/>
            <Page className="news-page">
                <div className="page-central-pane">
                    <FeedPage
                        nodeName={REL_CURRENT}
                        feedName="news"
                        title={getFeedTitle("news", t)}
                        visible={visible}
                    />;
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}

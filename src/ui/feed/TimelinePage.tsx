import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { isAtTimelinePage } from "state/navigation/selectors";
import { useIntersect } from "ui/hook";
import FeedPage from "ui/feed/FeedPage";
import { getFeedBackTitle, getFeedTitle } from "ui/feed/feeds";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./TimelinePage.css";

export default function TimelinePage() {
    const visible = useSelector(isAtTimelinePage);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    const [shadow, setShadow] = useState<boolean>(false);

    const onIntersect = useCallback(
        (intersecting: boolean) => setShadow(!intersecting),
        [setShadow]
    );

    const sentinel = useIntersect(onIntersect);

    return (
        <>
            <Page className="timeline-page">
                <div className="page-central-pane">
                    <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                        {getFeedTitle("timeline", t)}
                    </MobileBack>
                    <div className="desktop-back-sentinel" aria-hidden="true" ref={sentinel}/>
                    <div className="desktop-back-box">
                        <DesktopBack nodeName={REL_HOME} href={newsHref} className={cx({shadow})}>
                            {getFeedBackTitle("news", t)}
                        </DesktopBack>
                    </div>
                    <FeedPage
                        nodeName={REL_CURRENT}
                        feedName="timeline"
                        title={getFeedTitle("timeline", t)}
                        shareable
                        visible={visible}
                    />
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

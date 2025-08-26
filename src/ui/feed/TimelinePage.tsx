import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { tTitle } from "i18n";
import { isAtTimelinePage } from "state/navigation/selectors";
import { UnderlinedTabs } from "ui/control";
import { useIntersect, useIsTinyScreen } from "ui/hook";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { getFeedBackTitle, getFeedTitle } from "ui/feed/feeds";
import ProfileTitle from "ui/feed/ProfileTitle";
import FeedPage from "ui/feed/FeedPage";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./TimelinePage.css";

export default function TimelinePage() {
    const visible = useSelector(isAtTimelinePage);
    const newsHref = useMainMenuHomeNews().href;
    const tinyScreen = useIsTinyScreen();
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
                    {tinyScreen && <ProfileTitle/>}
                    <div className="back-box-sentinel" aria-hidden="true" ref={sentinel}/>
                    <div className="back-box">
                        <div className={cx("back-box-inner", {"back-box-shadow": shadow})}>
                            <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                {getFeedBackTitle("news", t)}
                            </DesktopBack>
                            <UnderlinedTabs tabs={[
                                {
                                    value: "posts",
                                    title: tTitle(t("profile-tabs.posts")),
                                    href: "/timeline"
                                }
                            ]} value="posts"/>
                        </div>
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

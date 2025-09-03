import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isAtTimelinePage } from "state/navigation/selectors";
import { OnlyMobile } from "ui/control";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ProfileTitle from "ui/profile/ProfileTitle";
import ProfileTabs from "ui/profile/ProfileTabs";
import { getFeedBackTitle, getFeedTitle } from "ui/feed/feeds";
import FeedPage from "ui/feed/FeedPage";
import FeedGotoButton from "ui/feed/FeedGotoButton";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./TimelinePage.css";

export default function TimelinePage() {
    const visible = useSelector(isAtTimelinePage);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    const [navigable, setNavigable] = useState<boolean>(false);
    const [atBottom, setAtBottom] = useState<boolean>(false);

    const onNavigationUpdate = useCallback((navigable: boolean, atBottom: boolean) => {
        setNavigable(navigable);
        setAtBottom(atBottom);
    }, []);

    return (
        <>
            <Page className="timeline-page profile-page">
                <div className="page-central-pane">
                    <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                        {getFeedTitle("timeline", t)}
                    </MobileBack>
                    <OnlyMobile><ProfileTitle/></OnlyMobile>
                    <BackBox>
                        <BackBoxInner>
                            <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                {getFeedBackTitle("news", t)}
                            </DesktopBack>
                            <ProfileTabs value="posts">
                                {navigable &&
                                    <FeedGotoButton nodeName={REL_CURRENT} feedName="timeline" atBottom={atBottom}/>
                                }
                            </ProfileTabs>
                        </BackBoxInner>
                    </BackBox>
                    <FeedPage
                        nodeName={REL_CURRENT}
                        feedName="timeline"
                        visible={visible}
                        onNavigationUpdate={onNavigationUpdate}
                    />
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

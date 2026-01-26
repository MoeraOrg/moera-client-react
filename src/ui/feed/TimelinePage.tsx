import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isRegularNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isAtTimelinePage } from "state/navigation/selectors";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import DesktopBack from "ui/page/DesktopBack";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ProfileTitle from "ui/profile/ProfileTitle";
import ProfileTabs from "ui/profile/ProfileTabs";
import ProfileSidebar from "ui/profile/ProfileSidebar";
import { useHomeNews } from "ui/feed/feeds";
import FeedPage from "ui/feed/FeedPage";
import FeedGotoButton from "ui/feed/FeedGotoButton";
import FeedNoContent from "ui/feed/nocontent/FeedNoContent";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./TimelinePage.css";

export default function TimelinePage() {
    const connectedToHome = useSelector(isConnectedToHome);
    const regularNode = useSelector(isRegularNode);
    const visible = useSelector(isAtTimelinePage);
    const newsHref = useHomeNews();
    const {t} = useTranslation();

    const [navigable, setNavigable] = useState<boolean>(false);
    const [atBottom, setAtBottom] = useState<boolean>(false);

    const onNavigationUpdate = useCallback((navigable: boolean, atBottom: boolean) => {
        setNavigable(navigable);
        setAtBottom(atBottom);
    }, []);

    // FIXME React.CSSProperties does not include CSS variables
    const pageStyle: any = {
        "--feed-header-height":
            !connectedToHome ? "calc(var(--page-header-height) - 3.3rem)" : "var(--page-header-height)",
    };

    return (
        <>
            <Page className="timeline-page tabbed-page">
                <div className="page-left-pane">
                    <ProfileSidebar/>
                </div>
                <main className="page-central-pane" style={pageStyle}>
                    <ProfileTitle/>
                    <BackBox>
                        <BackBoxInner>
                            {connectedToHome &&
                                <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                    {t("back-news")}
                                </DesktopBack>
                            }
                            <ProfileTabs value="posts">
                                {navigable &&
                                    <FeedGotoButton nodeName={REL_CURRENT} feedName="timeline" atBottom={atBottom}/>
                                }
                            </ProfileTabs>
                        </BackBoxInner>
                    </BackBox>
                    {regularNode ?
                        <FeedPage
                            nodeName={REL_CURRENT}
                            feedName="timeline"
                            visible={visible}
                            onNavigationUpdate={onNavigationUpdate}
                        />
                    :
                        <FeedNoContent nodeName={REL_CURRENT} feedName="timeline"/>
                    }
                </main>
                <div className="page-right-pane">
                    <MainMenuSidebar/>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

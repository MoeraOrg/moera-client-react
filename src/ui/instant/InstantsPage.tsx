import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { BUILD_NUMBER } from "build-number";
import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { OnlyDesktop } from "ui/control";
import { msMarkEmailRead } from "ui/material-symbols";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import DesktopBack from "ui/page/DesktopBack";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import NewsCounter from "ui/mainmenu/NewsCounter";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { useHomeNews } from "ui/feed/feeds";
import Instants from "ui/instant/Instants";
import { useInstantsToggler } from "ui/instant/instants-toggler";
import { REL_HOME } from "util/rel-node-name";
import "./InstantsPage.css";

export default function InstantsPage() {
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const {border, onToggle} = useInstantsToggler();
    const newsHref = useHomeNews();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        onToggle(true);
        return () => onToggle(false);
    }, [onToggle]);

    const onReadAll = () => {
        if (stories.length === 0) {
            return;
        }
        dispatch(feedStatusUpdate(REL_HOME, "instant", null, true, stories[0].moment));
    }

    return (
        <>
            <Page className="instants-page">
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <div className="page-central-pane">
                    <MobileMainMenu shadow menuItems={[
                        {icon: msMarkEmailRead, onClick: onReadAll},
                    ]}/>
                    <OnlyDesktop>
                        <BackBox>
                            <BackBoxInner>
                                <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                    {t("back-news")}<NewsCounter/>
                                </DesktopBack>
                            </BackBoxInner>
                        </BackBox>
                    </OnlyDesktop>
                    <main id="instants" className="content-panel">
                        <div className="content">
                            <Instants instantBorder={border}/>
                        </div>
                        <div className="footer">
                            <div className="build-number">rev {BUILD_NUMBER}</div>
                        </div>
                    </main>
                </div>
                <BottomMenu/>
            </Page>
        </>
    );
}

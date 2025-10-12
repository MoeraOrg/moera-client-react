import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import { useHomeNews } from "ui/feed/feeds";
import NewsCounter from "ui/mainmenu/NewsCounter";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ProfileTitle from "ui/profile/ProfileTitle";
import ProfileTabs from "ui/profile/ProfileTabs";
import ProfileSidebar from "ui/profile/ProfileSidebar";
import PeopleTop from "ui/people/PeopleTop";
import PeopleContent from "ui/people/PeopleContent";
import AskSelectedDialog from "ui/askdialog/AskSelectedDialog";
import PeopleSelectedHideDialog from "ui/peoplehidedialog/PeopleSelectedHideDialog";
import FriendGroupAddDialog from "ui/friendgroupadddialog/FriendGroupAddDialog";
import { REL_HOME } from "util/rel-node-name";
import "./PeoplePage.css";

export default function PeoplePage() {
    const connectedToHome = useSelector(isConnectedToHome);
    const showAskDialog = useSelector((state: ClientState) => state.askDialog.show);
    const showPeopleHideDialog = useSelector((state: ClientState) => state.peopleHideDialog.show);
    const showFriendGroupAddDialog = useSelector((state: ClientState) => state.friendGroupAddDialog.show);
    const newsHref = useHomeNews();
    const {t} = useTranslation();

    return (
        <Page className="people-page tabbed-page">
            <div className="page-left-pane">
                <ProfileSidebar/>
            </div>
            <div className="page-central-pane">
                <ProfileTitle/>
                <BackBox>
                    <BackBoxInner noShadow>
                        {connectedToHome &&
                            <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                {t("back-news")}<NewsCounter/>
                            </DesktopBack>
                        }
                        <ProfileTabs value="people"/>
                    </BackBoxInner>
                    <PeopleTop/>
                </BackBox>
                <PeopleContent/>
            </div>
            <div className="page-right-pane">
                <MainMenuSidebar/>
            </div>
            <BottomMenu/>
            {showAskDialog && <AskSelectedDialog/>}
            {showPeopleHideDialog && <PeopleSelectedHideDialog/>}
            {showFriendGroupAddDialog && <FriendGroupAddDialog/>}
        </Page>
    );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading, OnlyMobile } from "ui/control";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { getFeedBackTitle } from "ui/feed/feeds";
import ProfileTitle from "ui/profile/ProfileTitle";
import ProfileTabs from "ui/profile/ProfileTabs";
import PeopleTop from "ui/people/PeopleTop";
import PeopleContent from "ui/people/PeopleContent";
import AskSelectedDialog from "ui/askdialog/AskSelectedDialog";
import PeopleSelectedHideDialog from "ui/peoplehidedialog/PeopleSelectedHideDialog";
import FriendGroupAddDialog from "ui/friendgroupadddialog/FriendGroupAddDialog";
import { REL_HOME } from "util/rel-node-name";
import "./PeoplePage.css";

export default function PeoplePage() {
    const loadingGeneral = useSelector((state: ClientState) => state.people.loadingGeneral);
    const showAskDialog = useSelector((state: ClientState) => state.askDialog.show);
    const showPeopleHideDialog = useSelector((state: ClientState) => state.peopleHideDialog.show);
    const showFriendGroupAddDialog = useSelector((state: ClientState) => state.friendGroupAddDialog.show);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <Page className="people-page profile-page">
            <div className="page-central-pane">
                <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                    {t("people")}
                    {loadingGeneral && <Loading/>}
                </MobileBack>
                <OnlyMobile><ProfileTitle/></OnlyMobile>
                <BackBox>
                    <BackBoxInner noShadow>
                        <DesktopBack nodeName={REL_HOME} href={newsHref}>
                            {getFeedBackTitle("news", t)}
                            {loadingGeneral && <Loading/>}
                        </DesktopBack>
                        <ProfileTabs value="people"/>
                    </BackBoxInner>
                    <PeopleTop/>
                </BackBox>
                <PeopleContent/>
            </div>
            <BottomMenu/>
            {showAskDialog && <AskSelectedDialog/>}
            {showPeopleHideDialog && <PeopleSelectedHideDialog/>}
            {showFriendGroupAddDialog && <FriendGroupAddDialog/>}
        </Page>
    );
}

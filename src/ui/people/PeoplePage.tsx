import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading } from "ui/control";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { getFeedBackTitle } from "ui/feed/feeds";
import PeopleTabs from "ui/people/PeopleTabs";
import PeopleContent from "ui/people/PeopleContent";
import AskSelectedDialog from "ui/askdialog/AskSelectedDialog";
import PeopleSelectedHideDialog from "ui/peoplehidedialog/PeopleSelectedHideDialog";
import FriendGroupAddDialog from "ui/friendgroupadddialog/FriendGroupAddDialog";
import { REL_HOME } from "util/rel-node-name";
import "./PeoplePage.css";

export default function PeoplePage() {
    const tab = useSelector((state: ClientState) => state.people.tab);
    const loadingGeneral = useSelector((state: ClientState) => state.people.loadingGeneral);
    const showAskDialog = useSelector((state: ClientState) => state.askDialog.show);
    const showPeopleHideDialog = useSelector((state: ClientState) => state.peopleHideDialog.show);
    const showFriendGroupAddDialog = useSelector((state: ClientState) => state.friendGroupAddDialog.show);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <Page className="people-page">
            <div className="page-central-pane">
                <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                    {t("people")}
                    {loadingGeneral && <Loading/>}
                </MobileBack>
                <DesktopBack nodeName={REL_HOME} href={newsHref}>
                    {getFeedBackTitle("news", t)}
                    {loadingGeneral && <Loading/>}
                </DesktopBack>
                <div className="content-panel">
                    <PeopleTabs active={tab}/>
                    <PeopleContent/>
                </div>
            </div>
            <BottomMenu/>
            {showAskDialog && <AskSelectedDialog/>}
            {showPeopleHideDialog && <PeopleSelectedHideDialog/>}
            {showFriendGroupAddDialog && <FriendGroupAddDialog/>}
        </Page>
    );
}

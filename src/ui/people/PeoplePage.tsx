import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerName } from "state/node/selectors";
import { getSettingNode } from "state/settings/selectors";
import { Avatar, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import PeopleTabs from "ui/people/PeopleTabs";
import PeopleContent from "ui/people/PeopleContent";
import AskSelectedDialog from "ui/askdialog/AskSelectedDialog";
import PeopleSelectedHideDialog from "ui/peoplehidedialog/PeopleSelectedHideDialog";
import FriendGroupAddDialog from "ui/friendgroupadddialog/FriendGroupAddDialog";
import "./PeoplePage.css";

export default function PeoplePage() {
    const tab = useSelector((state: ClientState) => state.people.tab);
    const loadingGeneral = useSelector((state: ClientState) => state.people.loadingGeneral);
    const ownerAvatar = useSelector(getOwnerAvatar);
    const ownerName = useSelector(getOwnerName);
    const showAskDialog = useSelector((state: ClientState) => state.askDialog.show);
    const peopleHideDialog = {
        show: useSelector((state: ClientState) => state.peopleHideDialog.show),
        nodeName: useSelector((state: ClientState) => state.peopleHideDialog.nodeName),
        subscribersHidden: useSelector((state: ClientState) =>
                (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin"),
        subscriptionsHidden: useSelector((state: ClientState) =>
                (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin"),
        friendsHidden: useSelector((state: ClientState) =>
            (getSettingNode(state, "friends.view") as PrincipalValue ?? "public") === "admin")
    };
    const showFriendGroupAddDialog = useSelector((state: ClientState) => state.friendGroupAddDialog.show);
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>
                    <Jump href="/profile" title={t("profile")} className="avatar-link">
                        <Avatar avatar={ownerAvatar} ownerName={ownerName} size={40}/>
                    </Jump>
                    {t("people")} {loadingGeneral && <Loading/>}
                </h2>
            </PageHeader>
            <Page>
                <div className="people-page content-panel">
                    <PeopleTabs active={tab}/>
                    <PeopleContent/>
                </div>
                {showAskDialog && <AskSelectedDialog/>}
                {peopleHideDialog.show &&
                    <PeopleSelectedHideDialog nodeName={peopleHideDialog.nodeName}
                                              subscribersHidden={peopleHideDialog.subscribersHidden}
                                              subscriptionsHidden={peopleHideDialog.subscriptionsHidden}
                                              friendsHidden={peopleHideDialog.friendsHidden}/>
                }
                {showFriendGroupAddDialog && <FriendGroupAddDialog/>}
            </Page>
        </>
    );
}

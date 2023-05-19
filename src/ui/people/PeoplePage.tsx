import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerName } from "state/node/selectors";
import { Avatar, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import PeopleTabs from "ui/people/PeopleTabs";
import PeopleContent from "ui/people/PeopleContent";
import AskSelectedDialog from "ui/askdialog/AskSelectedDialog";
import PeopleSelectedHideDialog from "ui/peoplehidedialog/PeopleSelectedHideDialog";
import "./PeoplePage.css";

type Props = ConnectedProps<typeof connector>;

const PeoplePage = ({tab, loadingGeneral, ownerAvatar, ownerName}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>
                    <Jump href="/profile" title={t("profile")} className="avatar-link">
                        <Avatar avatar={ownerAvatar} ownerName={ownerName} size={40}/>
                    </Jump>
                    {t("people")} <Loading active={loadingGeneral}/>
                </h2>
            </PageHeader>
            <Page>
                <div className="people-page content-panel">
                    <PeopleTabs active={tab}/>
                    <PeopleContent/>
                </div>
                <AskSelectedDialog/>
                <PeopleSelectedHideDialog/>
            </Page>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        tab: state.people.tab,
        loadingGeneral: state.people.loadingGeneral,
        ownerAvatar: getOwnerAvatar(state),
        ownerName: getOwnerName(state)
    })
);

export default connector(PeoplePage);

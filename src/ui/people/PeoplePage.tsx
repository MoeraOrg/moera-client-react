import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerName } from "state/owner/selectors";
import { isSubscribersVisible, isSubscriptionsVisible } from "state/people/selectors";
import { Avatar, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import PeopleTabs from "ui/people/PeopleTabs";
import SubscribersSubpage from "ui/people/SubscribersSubpage";
import SubscriptionsSubpage from "ui/people/SubscriptionsSubpage";
import "./PeoplePage.css";

type Props = ConnectedProps<typeof connector>;

const PeoplePage = ({tab, loadingGeneral, ownerAvatar, ownerName, subscribersVisible, subscriptionsVisible}: Props) => (
    <>
        <PageHeader>
            <h2>
                <Jump href="/profile" title="Profile" className="avatar-link">
                    <Avatar avatar={ownerAvatar} ownerName={ownerName} size={40}/>
                </Jump>
                People <Loading active={loadingGeneral}/>
            </h2>
        </PageHeader>
        <Page>
            <div className="people-page">
                <PeopleTabs active={tab}/>
                {(tab === "subscribers" && subscribersVisible) &&
                    <SubscribersSubpage/>
                }
                {(tab === "subscriptions" && subscriptionsVisible) &&
                    <SubscriptionsSubpage/>
                }
            </div>
        </Page>
    </>
);

const connector = connect(
    (state: ClientState) => ({
        tab: state.people.tab,
        loadingGeneral: state.people.loadingGeneral,
        ownerAvatar: getOwnerAvatar(state),
        ownerName: getOwnerName(state),
        subscribersVisible: isSubscribersVisible(state),
        subscriptionsVisible: isSubscriptionsVisible(state)
    })
);

export default connector(PeoplePage);

import React from 'react';
import { connect } from 'react-redux';

import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import { Avatar, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import PeopleTabs from "ui/people/PeopleTabs";
import SubscribersSubpage from "ui/people/SubscribersSubpage";
import SubscriptionsSubpage from "ui/people/SubscriptionsSubpage";
import { getOwnerAvatar } from "state/owner/selectors";
import "./PeoplePage.css";

const PeoplePage = ({tab, loadingGeneral, ownerAvatar}) => (
    <>
        <PageHeader>
            <h2>
                <Jump href="/profile" title="Profile" className="avatar-link">
                    <Avatar avatar={ownerAvatar} size={40}/>
                </Jump>
                People <Loading active={loadingGeneral}/>
            </h2>
        </PageHeader>
        <Page>
            <div className="people-page">
                <PeopleTabs active={tab}/>
                {tab === "subscribers" && <SubscribersSubpage/>}
                {tab === "subscriptions" && <SubscriptionsSubpage/>}
            </div>
        </Page>
    </>
);

export default connect(
    state => ({
        tab: state.people.tab,
        loadingGeneral: state.people.loadingGeneral,
        ownerAvatar: getOwnerAvatar(state)
    })
)(PeoplePage);

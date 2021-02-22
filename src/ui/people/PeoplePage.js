import React from 'react';
import { connect } from 'react-redux';

import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import { Loading } from "ui/control";
import PeopleTabs from "ui/people/PeopleTabs";
import SubscribersSubpage from "ui/people/SubscribersSubpage";
import SubscriptionsSubpage from "ui/people/SubscriptionsSubpage";
import "./PeoplePage.css";

const PeoplePage = ({tab, loadingGeneral}) => (
    <>
        <PageHeader>
            <h2>People <Loading active={loadingGeneral}/></h2>
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
        loadingGeneral: state.people.loadingGeneral
    })
)(PeoplePage);

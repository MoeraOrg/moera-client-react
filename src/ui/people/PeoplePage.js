import React from 'react';
import { connect } from 'react-redux';

import { Page } from "ui/page/Page";
import { Loading } from "ui/control";
import PeopleTabs from "ui/people/PeopleTabs";

const PeoplePage = ({tab, loadingGeneral}) => (
    <Page className="mt-3">
        <h2>People <Loading active={loadingGeneral}/></h2>
        <br/>
        <PeopleTabs active={tab}/>
    </Page>
);

export default connect(
    state => ({
        tab: state.people.tab,
        loadingGeneral: state.people.loadingGeneral
    })
)(PeoplePage);

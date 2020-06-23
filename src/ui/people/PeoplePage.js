import React from 'react';
import { connect } from 'react-redux';

import { Page } from "ui/page/Page";
import PeopleTabs from "ui/people/PeopleTabs";

const PeoplePage = ({tab}) => (
    <Page className="mt-3">
        <h2>People</h2>
        <br/>
        <PeopleTabs active={tab}/>
    </Page>
);

export default connect(
    state => ({
        tab: state.people.tab
    })
)(PeoplePage);

import React from 'react';
import { connect } from 'react-redux';

import { Page } from "ui/page/Page";

const PeoplePage = ({tab}) => (
    <Page className="mt-3">
        <h2>People</h2>
        <br/>
    </Page>
);

export default connect(
    state => ({
        tab: state.people.tab
    })
)(PeoplePage);

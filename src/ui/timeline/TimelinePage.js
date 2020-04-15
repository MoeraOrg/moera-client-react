import React from 'react';
import { connect } from 'react-redux';

import { isAtTimelinePage } from "state/navigation/selectors";
import { Page } from "ui/page/Page";
import FeedPage from "ui/feed/FeedPage";

const TimelinePage = ({visible}) => (
    <Page>
        <FeedPage feedName="timeline" title="Timeline" visible={visible}/>
    </Page>
);

export default connect(
    state => ({
        visible: isAtTimelinePage(state)
    })
)(TimelinePage);

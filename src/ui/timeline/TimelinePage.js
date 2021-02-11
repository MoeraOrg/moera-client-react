import React from 'react';
import { connect } from 'react-redux';

import { isAtTimelinePage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";

const TimelinePage = ({visible}) => (
    <FeedPage feedName="timeline" title="Timeline" visible={visible}/>
);

export default connect(
    state => ({
        visible: isAtTimelinePage(state)
    })
)(TimelinePage);

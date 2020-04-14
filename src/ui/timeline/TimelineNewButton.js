import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { isFeedAddable } from "state/feeds/selectors";
import { goToCompose } from "state/navigation/actions";
import "./TimelineNewButton.css"

const TimelineNewButton = ({enabled, goToCompose}) => (
    enabled &&
        <div className="timeline-new-btn timeline-btn">
            <Button variant="success" size="sm" onClick={() => goToCompose()}>New</Button>
        </div>
);

export default connect(
    state => ({
        enabled: isFeedAddable(state, "timeline")
    }),
    { goToCompose }
)(TimelineNewButton);

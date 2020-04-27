import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getFeedState } from "state/feeds/selectors";
import "./InstantBell.css";

const Bell = ({count}) => (
    <span className="connection-button bell-button" title="Notifications">
        <FontAwesomeIcon icon="bell"/>
        {count > 0 && <div className="count">{count}</div>}
    </span>
);

export default connect(
    state => ({
        count: getFeedState(state, ":instant").notViewed
    })
)(Bell);

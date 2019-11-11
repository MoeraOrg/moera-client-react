import React from 'react';
import { connect } from 'react-redux';

import Events from "ui/events/Events";
import { getHomeToken } from "state/home/selectors";

const NodeEvents = ({homeEvents, token}) => (
    <Events location={homeEvents} token={token} prefix="EVENT_HOME_"/>
);

export default connect(
    state => ({
        homeEvents: state.home.root.events,
        token: getHomeToken(state)
    })
)(NodeEvents);

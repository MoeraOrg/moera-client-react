import React from 'react';
import { connect } from 'react-redux';

import Events from "ui/events/Events";
import { getHomeOwnerName, getHomeToken } from "state/home/selectors";

const HomeEvents = ({homeEvents, token, sourceNode}) => (
    <Events location={homeEvents} token={token} prefix="EVENT_HOME_" sourceNode={sourceNode}/>
);

export default connect(
    state => ({
        homeEvents: state.home.root.events,
        token: getHomeToken(state),
        sourceNode: getHomeOwnerName(state)
    })
)(HomeEvents);

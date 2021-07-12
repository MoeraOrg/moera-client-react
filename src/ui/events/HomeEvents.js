import React from 'react';
import { connect } from 'react-redux';

import Events from "ui/events/Events";
import { getHomeOwnerName, getHomeToken } from "state/home/selectors";
import { wakeUp } from "state/navigation/actions";

const HomeEvents = ({homeEvents, token, sourceNode, wakeUp}) => (
    <Events location={homeEvents} token={token} prefix="HOME" sourceNode={sourceNode}
            onWakeUp={() => wakeUp()}/>
);

export default connect(
    state => ({
        homeEvents: state.home.root.events,
        token: getHomeToken(state),
        sourceNode: getHomeOwnerName(state)
    }),
    { wakeUp }
)(HomeEvents);

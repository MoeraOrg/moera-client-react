import React from 'react';
import { connect } from 'react-redux';

import Events from "ui/events/Events";
import { getNodeToken } from "state/node/selectors";

const NodeEvents = ({nodeEvents, token}) => (
    <Events location={nodeEvents} token={token} prefix="EVENT_NODE_"/>
);

export default connect(
    state => ({
        nodeEvents: state.node.root.events,
        token: getNodeToken(state)
    })
)(NodeEvents);

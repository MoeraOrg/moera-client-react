import React from 'react';
import { connect } from 'react-redux';

import Events from "ui/events/Events";
import { getNodeToken } from "state/node/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getReceiverNodeName } from "state/receiver/selectors";

const NodeEvents = ({nodeEvents, token, prefix, sourceNode}) => (
    <Events location={nodeEvents} token={token} prefix={prefix} sourceNode={sourceNode}/>
);

export default connect(
    state => ({
        nodeEvents: state.node.root.events,
        token: getNodeToken(state),
        prefix: getReceiverNodeName(state) == null ? ["EVENT_NODE_", "EVENT_RECEIVER_"] : "EVENT_NODE_",
        sourceNode: getOwnerName(state)
    })
)(NodeEvents);

import React from 'react';
import { connect } from 'react-redux';

import Events from "ui/events/Events";
import { getToken } from "state/node/selectors";
import { getReceiverNodeName, getReceiverNodeUri } from "state/receiver/selectors";
import { nodeUrlToEvents, nodeUrlToLocation } from "util/url";

const ReceiverEvents = ({nodeEvents, token, sourceNode}) => (
    <Events location={nodeEvents} token={token} prefix="EVENT_RECEIVER_" sourceNode={sourceNode}/>
);

export default connect(
    state => {
        const receiverNodeUri = getReceiverNodeUri(state);
        return ({
            nodeEvents: nodeUrlToEvents(receiverNodeUri),
            token: getToken(state, nodeUrlToLocation(receiverNodeUri)),
            sourceNode: getReceiverNodeName(state)
        });
    }
)(ReceiverEvents);

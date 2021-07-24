import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Events from "ui/events/Events";
import { getToken } from "state/node/selectors";
import { getReceiverNodeName, getReceiverNodeUri } from "state/receiver/selectors";
import { nodeUrlToEvents, nodeUrlToLocation } from "util/url";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const ReceiverEvents = ({nodeEvents, token, sourceNode}: Props) => (
    <Events location={nodeEvents} token={token} prefix="RECEIVER" sourceNode={sourceNode}/>
);

const connector = connect(
    (state: ClientState) => {
        const receiverNodeUri = getReceiverNodeUri(state);
        return ({
            nodeEvents: nodeUrlToEvents(receiverNodeUri),
            token: getToken(state, nodeUrlToLocation(receiverNodeUri)),
            sourceNode: getReceiverNodeName(state)
        });
    }
);

export default connector(ReceiverEvents);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getToken } from "state/node/selectors";
import { getReceiverNodeName, getReceiverNodeUri } from "state/receiver/selectors";
import { getCurrentCarte } from "state/cartes/selectors";
import Events from "ui/events/Events";
import { nodeUrlToEvents, nodeUrlToLocation } from "util/url";

type Props = ConnectedProps<typeof connector>;

const ReceiverEvents = ({nodeEvents, token, carte, sourceNode}: Props) => (
    <Events location={nodeEvents} token={token} carte={carte} prefix="RECEIVER" sourceNode={sourceNode}/>
);

const connector = connect(
    (state: ClientState) => {
        const receiverNodeUri = getReceiverNodeUri(state);
        return ({
            nodeEvents: nodeUrlToEvents(receiverNodeUri),
            token: getToken(state, nodeUrlToLocation(receiverNodeUri)),
            carte: getCurrentCarte(state),
            sourceNode: getReceiverNodeName(state)
        });
    }
);

export default connector(ReceiverEvents);

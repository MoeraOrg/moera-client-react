import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getToken } from "state/node/selectors";
import { getReceiverNodeName, getReceiverNodeUri } from "state/receiver/selectors";
import { getCurrentAllCarte } from "state/cartes/selectors";
import Events from "ui/events/Events";
import { nodeUrlToEvents, nodeUrlToLocation } from "util/url";

export default function ReceiverEvents() {
    const receiverNodeUri = useSelector(getReceiverNodeUri);
    const nodeEvents = nodeUrlToEvents(receiverNodeUri);
    const token = useSelector((state: ClientState) => getToken(state, nodeUrlToLocation(receiverNodeUri)));
    const carte = useSelector(getCurrentAllCarte);
    const sourceNode = useSelector(getReceiverNodeName);

    return (
        <Events location={nodeEvents} token={token} carte={carte} prefix="RECEIVER" sourceNode={sourceNode}/>
    );
}

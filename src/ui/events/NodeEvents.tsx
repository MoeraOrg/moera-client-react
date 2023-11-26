import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getNodeToken, getOwnerName } from "state/node/selectors";
import { getReceiverNodeName } from "state/receiver/selectors";
import { getCurrentAllCarte } from "state/cartes/selectors";
import Events from "ui/events/Events";

export default function NodeEvents() {
    const nodeEvents = useSelector((state: ClientState) => state.node.root.events);
    const token = useSelector(getNodeToken);
    const carte = useSelector(getCurrentAllCarte);
    const prefix = useSelector(getReceiverNodeName) == null ? ["NODE" as const, "RECEIVER" as const] : "NODE" as const;
    const sourceNode = useSelector(getOwnerName);

    return (
        <Events location={nodeEvents} token={token} carte={carte} prefix={prefix} sourceNode={sourceNode}/>
    );
}

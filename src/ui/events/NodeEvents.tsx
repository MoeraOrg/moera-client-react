import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Events from "ui/events/Events";
import { getNodeToken } from "state/node/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getReceiverNodeName } from "state/receiver/selectors";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const NodeEvents = ({nodeEvents, token, prefix, sourceNode}: Props) => (
    <Events location={nodeEvents} token={token} prefix={prefix} sourceNode={sourceNode}/>
);

const connector = connect(
    (state: ClientState) => ({
        nodeEvents: state.node.root.events,
        token: getNodeToken(state),
        prefix: getReceiverNodeName(state) == null ? ["NODE" as const, "RECEIVER" as const] : "NODE" as const,
        sourceNode: getOwnerName(state)
    })
);

export default connector(NodeEvents);

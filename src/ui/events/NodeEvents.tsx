import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getNodeToken, getOwnerName } from "state/node/selectors";
import { getReceiverNodeName } from "state/receiver/selectors";
import { getCurrentAllCarte } from "state/cartes/selectors";
import Events from "ui/events/Events";

type Props = ConnectedProps<typeof connector>;

const NodeEvents = ({nodeEvents, token, carte, prefix, sourceNode}: Props) => (
    <Events location={nodeEvents} token={token} carte={carte} prefix={prefix} sourceNode={sourceNode}/>
);

const connector = connect(
    (state: ClientState) => ({
        nodeEvents: state.node.root.events,
        token: getNodeToken(state),
        carte: getCurrentAllCarte(state),
        prefix: getReceiverNodeName(state) == null ? ["NODE" as const, "RECEIVER" as const] : "NODE" as const,
        sourceNode: getOwnerName(state)
    })
);

export default connector(NodeEvents);

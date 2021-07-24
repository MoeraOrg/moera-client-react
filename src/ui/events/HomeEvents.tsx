import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Events from "ui/events/Events";
import { getHomeOwnerName, getHomeToken } from "state/home/selectors";
import { wakeUp } from "state/navigation/actions";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const HomeEvents = ({homeEvents, token, sourceNode, wakeUp}: Props) => (
    <Events location={homeEvents} token={token} prefix="HOME" sourceNode={sourceNode}
            onWakeUp={() => wakeUp()}/>
);

const connector = connect(
    (state: ClientState) => ({
        homeEvents: state.home.root.events,
        token: getHomeToken(state),
        sourceNode: getHomeOwnerName(state)
    }),
    { wakeUp }
);

export default connector(HomeEvents);

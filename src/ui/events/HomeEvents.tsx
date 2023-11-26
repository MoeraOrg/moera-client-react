import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Events from "ui/events/Events";
import { getHomeOwnerName, getHomeToken } from "state/home/selectors";
import { wakeUp } from "state/navigation/actions";
import { ClientState } from "state/state";

export default function HomeEvents() {
    const homeEvents = useSelector((state: ClientState) => state.home.root.events);
    const token = useSelector(getHomeToken);
    const sourceNode = useSelector(getHomeOwnerName);
    const dispatch = useDispatch();

    return (
        <Events location={homeEvents} token={token} carte={null} prefix="HOME" sourceNode={sourceNode}
                onWakeUp={() => dispatch(wakeUp())}/>
    );
}

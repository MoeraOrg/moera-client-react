import React from 'react';
import { useSelector } from 'react-redux';

import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { Avatar, Popover } from "ui/control";
import Connections from "ui/mainmenu/connections/Connections";
import { REL_HOME } from "util/rel-node-name";

export default function ConnectionsButton() {
    const ownerName = useSelector(getHomeOwnerName);
    const avatar = useSelector(getHomeOwnerAvatar);

    return (
        <>
            <Popover
                text={
                    <Avatar avatar={avatar} ownerName={ownerName} size={32} nodeName={REL_HOME}
                            className="home-avatar"/>
                }
                detached
                offset={[0, 10]}
            >
                <Connections/>
            </Popover>
        </>
    );
}

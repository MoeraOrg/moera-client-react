import React from 'react';
import { useSelector } from 'react-redux';

import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { Avatar, Popover } from "ui/control";
import Connections from "ui/mainmenu/connections/Connections";
import { REL_HOME } from "util/rel-node-name";
import "./ConnectionsButton.css";

export default function ConnectionsButton() {
    const ownerName = useSelector(getHomeOwnerName);
    const avatar = useSelector(getHomeOwnerAvatar);

    return (
        <>
            <Popover
                text={
                    <Avatar avatar={avatar} ownerName={ownerName} size={40} nodeName={REL_HOME}
                            className="home-avatar"/>
                }
                detached
                placement="bottom-end"
                offset={[0, 30]}
            >
                <Connections/>
            </Popover>
        </>
    );
}

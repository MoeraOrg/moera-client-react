import React from 'react';
import { useSelector } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import MainMenuPages from "ui/mainmenu/pages/MainMenuPages";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import HomeAvatar from "ui/mainmenu/connections/HomeAvatar";
import HomeName from "ui/mainmenu/connections/HomeName";
import "./VerticalMenu.css";

export default function VerticalMenu() {
    const atNode = useSelector(isAtNode);
    const connected = useSelector(isConnectedToHome);

    return (
        <div id="vertical-menu" className="navbar-dark bg-dark">
            {atNode && <MainMenuPages/>}
            {connected &&
                <>
                    <div className="text-center">
                        <HomeAvatar/>
                        <HomeName/>
                    </div>
                    <div className="text-end">
                        <DisconnectButton/>
                    </div>
                </>
            }
        </div>
    );
}

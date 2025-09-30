import React from 'react';
import { useSelector } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { OnlyDesktop } from "ui/control";
import Logo from "ui/mainmenu/logo/Logo";
import Search from "ui/mainmenu/search/Search";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import InvitationAlert from "ui/mainmenu/InvitationAlert";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import "./DesktopMainMenu.css";

export default function DesktopMainMenu() {
    const connectedToHome = useSelector(isConnectedToHome);

    return (
        <OnlyDesktop>
            <nav id="main-menu">
                <div className="main-menu-content">
                    <div className="main-menu-left-pane">
                        <Logo/>
                    </div>
                    <div className="main-menu-center-pane">
                        <Search/>
                    </div>
                    <div className="main-menu-right-pane">
                        <ConnectionStatus/>
                    </div>
                </div>
            </nav>
            {!connectedToHome && <InvitationAlert/>}
            <RefreshIndicator/>
        </OnlyDesktop>
    );
}

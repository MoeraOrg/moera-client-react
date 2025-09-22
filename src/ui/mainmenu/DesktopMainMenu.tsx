import React from 'react';

import { OnlyDesktop } from "ui/control";
import Logo from "ui/mainmenu/logo/Logo";
import Search from "ui/mainmenu/search/Search";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import "./DesktopMainMenu.css";

const DesktopMainMenu = () => (
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
        <RefreshIndicator/>
    </OnlyDesktop>
);

export default DesktopMainMenu;

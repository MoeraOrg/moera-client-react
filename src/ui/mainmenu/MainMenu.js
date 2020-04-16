import React from 'react';

import Logo from "ui/mainmenu/logo/Logo";
import OwnerSwitcher from "ui/mainmenu/owner/OwnerSwitcher";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import MainMenuTimelineLink from "ui/mainmenu/MainMenuTimelineLink";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import { PAGE_PROFILE } from "state/navigation/pages";
import "./MainMenu.css";

const MainMenu = () => (
    <nav id="main-menu" className="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
        <Logo/>
        <OwnerSwitcher/>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
                <MainMenuTimelineLink/>
                <MainMenuLink page={PAGE_PROFILE} href="/profile">PROFILE</MainMenuLink>
            </ul>
        </div>
        <ConnectionStatus />
    </nav>
);

export default MainMenu;

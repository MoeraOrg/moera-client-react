import React from 'react';

import Logo from "ui/mainmenu/logo/Logo";
import OwnerSwitcher from "ui/mainmenu/owner/OwnerSwitcher";
import MainMenuPages from "ui/mainmenu/MainMenuPages";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import VerticalMenuToggler from "ui/mainmenu/vertical/VerticalMenuToggler";
import "./MainMenu.css";

const MainMenu = () => (
    <nav id="main-menu" className="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
        <Logo/>
        <OwnerSwitcher/>
        <div className="collapse navbar-collapse">
            <MainMenuPages/>
        </div>
        <ConnectionStatus/>
        <VerticalMenuToggler/>
    </nav>
);

export default MainMenu;

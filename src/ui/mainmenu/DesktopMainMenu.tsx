import React from 'react';
import { useSelector } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import { useIsTinyScreen } from "ui/hook";
import Logo from "ui/mainmenu/logo/Logo";
import OwnerSwitcher from "ui/mainmenu/owner/OwnerSwitcher";
import MainMenuPages from "ui/mainmenu/pages/MainMenuPages";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import "./DesktopMainMenu.css";

export default function DesktopMainMenu() {
    const atNode = useSelector(isAtNode);

    const tinyScreen = useIsTinyScreen();
    if (tinyScreen) {
        return null;
    }

    return (
        <>
            <nav id="main-menu" className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
                <Logo/>
                {atNode ?
                    <>
                        <OwnerSwitcher/>
                        <div className="collapse navbar-collapse">
                            <MainMenuPages/>
                        </div>
                    </>
                :
                    <div className="collapse navbar-collapse"/>
                }
                <ConnectionStatus/>
            </nav>
            <RefreshIndicator/>
        </>
    );
}

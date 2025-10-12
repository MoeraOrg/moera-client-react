import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { isConnectedToHome } from "state/home/selectors";
import { OnlyDesktop } from "ui/control";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import Logo from "ui/mainmenu/logo/Logo";
import Search from "ui/mainmenu/search/Search";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import InvitationAlert from "ui/mainmenu/InvitationAlert";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import "./DesktopMainMenu.css";

interface Props {
    transparent?: boolean;
}

export default function DesktopMainMenu({transparent}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const {shadow, sentinel} = useScrollShadow();

    return (
        <OnlyDesktop>
            <div id="main-menu-sentinel" aria-hidden="true" ref={sentinel}/>
            <header id="main-menu" className={cx({transparent: transparent && shadow})}>
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
            </header>
            {!connectedToHome && <InvitationAlert/>}
            <RefreshIndicator/>
        </OnlyDesktop>
    );
}

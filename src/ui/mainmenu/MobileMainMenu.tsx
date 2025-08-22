import React from 'react';
import { useSelector } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import { useIsTinyScreen } from "ui/hook";
import Logo from "ui/mainmenu/logo/Logo";
import OwnerSwitcher from "ui/mainmenu/owner/OwnerSwitcher";
import VerticalMenuToggler from "ui/mainmenu/vertical/VerticalMenuToggler";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";

export default function MobileMainMenu() {
    const atNode = useSelector(isAtNode);

    const tinyScreen = useIsTinyScreen();
    if (!tinyScreen) {
        return null;
    }

    return (
        <>
            <nav id="main-menu" className="navbar sticky-top navbar-dark bg-dark">
                <Logo/>
                {atNode &&
                    <OwnerSwitcher/>
                }
                <div className="collapse navbar-collapse"/>
                <VerticalMenuToggler/>
            </nav>
            <RefreshIndicator/>
        </>
    );
}

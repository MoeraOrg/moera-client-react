import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import Sandwich from "ui/mainmenu/sandwich/Sandwich";
import Logo from "ui/mainmenu/logo/Logo";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import ConnectionsDialog from "ui/mainmenu/connections/ConnectionsDialog";
import { Icon, msSearch, msSettings } from "ui/material-symbols";
import { OnlyMobile } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./MobileMainMenu.css";

interface Props {
    shadow?: boolean;
}

export default function MobileMainMenu({shadow: hasShadow}: Props) {
    const showConnectionsDialog = useSelector((state: ClientState) => state.home.connectionsDialog.show);
    const {shadow, sentinel} = useScrollShadow();

    return (
        <OnlyMobile>
            <div id="main-menu-sentinel" aria-hidden="true" ref={sentinel}/>
            <nav id="main-menu" className={cx({shadow: hasShadow && shadow})}>
                <Sandwich/>
                <Logo/>
                <Jump className="btn btn-tool-round" href="/settings">
                    <Icon icon={msSettings} size={20}/>
                </Jump>
                <Jump className="btn btn-tool-round" href="/search">
                    <Icon icon={msSearch} size={20}/>
                </Jump>
            </nav>
            <RefreshIndicator/>
            {showConnectionsDialog && <ConnectionsDialog/>}
        </OnlyMobile>
    );
}

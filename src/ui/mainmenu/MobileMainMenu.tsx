import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import Sandwich from "ui/mainmenu/sandwich/Sandwich";
import Logo from "ui/mainmenu/logo/Logo";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import ConnectionsDialog from "ui/mainmenu/connections/ConnectionsDialog";
import { Icon, MaterialSymbol, msSearch, msSettings } from "ui/material-symbols";
import { Button, OnlyMobile } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./MobileMainMenu.css";

interface MainMenuItem {
    href?: string;
    onClick?: () => void;
    icon: MaterialSymbol;
    visible?: boolean;
}

interface Props {
    shadow?: boolean;
    menuItems?: MainMenuItem[];
}

export default function MobileMainMenu({shadow: hasShadow, menuItems}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const showConnectionsDialog = useSelector((state: ClientState) => state.home.connectionsDialog.show);
    const {shadow, sentinel} = useScrollShadow();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const buttons = menuItems ?? [
        {href: "/settings", icon: msSettings, visible: connectedToHome},
        {href: "/search", icon: msSearch},
    ];

    return (
        <OnlyMobile>
            <div id="main-menu-sentinel" aria-hidden="true" ref={sentinel}/>
            <header id="main-menu" className={cx({shadow: hasShadow && shadow})}>
                <Sandwich/>
                <Logo/>
                {buttons.filter(item => item.visible !== false).map((item, index) => (
                    item.href != null ?
                        <Jump key={index} className="btn btn-tool-round" href={item.href}>
                            <Icon icon={item.icon} size={20}/>
                        </Jump>
                    :
                        <Button key={index} variant="tool-round" onClick={item.onClick}>
                            <Icon icon={item.icon} size={20}/>
                        </Button>
                ))}
                {!connectedToHome &&
                    <Button variant="primary" onClick={() => dispatch(openConnectDialog())}>
                        {t("connect")}
                    </Button>
                }
            </header>
            <RefreshIndicator/>
            {showConnectionsDialog && <ConnectionsDialog/>}
        </OnlyMobile>
    );
}

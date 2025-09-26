import React from 'react';
import cx from 'classnames';

import Sandwich from "ui/mainmenu/Sandwich";
import Logo from "ui/mainmenu/logo/Logo";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import { Icon, msSearch, msSettings } from "ui/material-symbols";
import { Button, OnlyMobile } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./MobileMainMenu.css";

interface Props {
    shadow?: boolean;
}

export default function MobileMainMenu({shadow: hasShadow}: Props) {
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
                <Button variant="tool-round">
                    <Icon icon={msSearch} size={20}/>
                </Button>
            </nav>
            <RefreshIndicator/>
        </OnlyMobile>
    );
}

import React from 'react';
import cx from 'classnames';

import { Icon, msArrowBack, msMoreVert } from "ui/material-symbols";
import { DropdownMenu, OnlyMobile } from "ui/control";
import { MenuItem } from "ui/control/dropdownmenu/dropdown-menu-types";
import Jump from "ui/navigation/Jump";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import { RelNodeName } from "util/rel-node-name";
import "./MobileBack.css";

interface Props {
    nodeName?: RelNodeName | string;
    href: string;
    className?: string;
    sticky?: boolean;
    onBack?: () => void;
    menuContent?: React.ReactNode;
    menuItems?: MenuItem[];
    children?: React.ReactNode;
}

export default function MobileBack({
    nodeName, href, className, sticky, onBack, menuContent, menuItems, children
}: Props) {
    const {shadow, sentinel} = useScrollShadow();

    const onJump = onBack ? () => onBack() : (href ? undefined : () => window.overlays.mobileBack());

    return (
        <OnlyMobile>
            <div className="mobile-back-sentinel" aria-hidden="true" ref={sentinel}/>
            <div className={cx("mobile-back", {sticky, "mobile-back-shadow": shadow}, className)}>
                <Jump className="btn btn-silent-round" nodeName={nodeName} href={href} onNear={onJump} onFar={onJump}>
                    <Icon icon={msArrowBack} size={24}/>
                </Jump>
                <div className="content">{children}</div>
                {(menuContent != null || menuItems != null) &&
                    <DropdownMenu
                        content={menuContent}
                        items={menuItems}
                        menuContainer={document.getElementById("modal-root")}
                    >
                        <Icon icon={msMoreVert} size="1.7rem"/>
                    </DropdownMenu>
                }
            </div>
        </OnlyMobile>
    );
}

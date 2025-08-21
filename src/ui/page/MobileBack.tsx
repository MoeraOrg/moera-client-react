import React from 'react';
import cx from 'classnames';

import { Icon, msArrowBack } from "ui/material-symbols";
import { useIsTinyScreen } from "ui/hook/media-query";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import "./MobileBack.css";

interface Props {
    nodeName?: RelNodeName | string;
    href: string;
    className?: string;
    onBack?: () => void;
    children?: React.ReactNode;
}

export default function MobileBack({nodeName, href, className, onBack, children}: Props) {
    const tinyScreen = useIsTinyScreen();
    if (!tinyScreen) {
        return null;
    }

    const onJump = onBack ? () => onBack() : undefined;

    return (
        <div className={cx("mobile-back", className)}>
            <Jump className="btn btn-silent-round" nodeName={nodeName} href={href} onNear={onJump} onFar={onJump}>
                <Icon icon={msArrowBack} size={24}/>
            </Jump>
            {children}
        </div>
    );
}

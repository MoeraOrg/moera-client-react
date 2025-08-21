import React from 'react';
import cx from 'classnames';

import { Icon, msArrowBack } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import "./DesktopBack.css";

interface Props {
    nodeName?: RelNodeName | string;
    href: string;
    className?: string;
    onBack?: () => void;
    children?: React.ReactNode;
}

export default function DesktopBack({nodeName, href, className, onBack, children}: Props) {
    const onJump = onBack ? () => onBack() : undefined;

    return (
        <Jump className={cx("desktop-back", className)} nodeName={nodeName} href={href} onNear={onJump} onFar={onJump}>
            <span className="btn btn-tool-round">
                <Icon icon={msArrowBack} size={16}/>
            </span>
            {children}
        </Jump>
    );
}

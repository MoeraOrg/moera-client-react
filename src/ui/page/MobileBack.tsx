import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import { Icon, msArrowBack } from "ui/material-symbols";
import { useIntersect, useIsTinyScreen } from "ui/hook";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import "./MobileBack.css";

interface Props {
    nodeName?: RelNodeName | string;
    href: string;
    className?: string;
    sticky?: boolean;
    onBack?: () => void;
    children?: React.ReactNode;
}

export default function MobileBack({nodeName, href, className, sticky, onBack, children}: Props) {
    const [shadow, setShadow] = useState<boolean>(false);

    const onIntersect = useCallback(
        (intersecting: boolean) => setShadow(!intersecting),
        [setShadow]
    );

    const sentinel = useIntersect(onIntersect);

    const tinyScreen = useIsTinyScreen();

    if (!tinyScreen) {
        return null;
    }

    const onJump = onBack ? () => onBack() : undefined;

    return (
        <>
            <div className="mobile-back-sentinel" aria-hidden="true" ref={sentinel}/>
            <div className={cx("mobile-back", {sticky, shadow}, className)}>
                <Jump className="btn btn-silent-round" nodeName={nodeName} href={href} onNear={onJump} onFar={onJump}>
                    <Icon icon={msArrowBack} size={24}/>
                </Jump>
                {children}
            </div>
        </>
    );
}

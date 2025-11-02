import React from 'react';
import { useSelector } from 'react-redux';

import { isRegularNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { useIsTinyScreen } from "ui/hook";
import Jump from "ui/navigation/Jump";
import { ReactComponent as LogoSvg } from "ui/mainmenu/logo/logo.isvg";
import { useHomeNews, useTimeline } from "ui/feed/feeds";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

interface LogoImageProps {
    className?: string;
    width?: number | string;
    height?: number | string;
}

export const LogoImage = ({className, width, height}: LogoImageProps) =>
    React.createElement(LogoSvg, {className, height, width});

export default function Logo() {
    const connectedToHome = useSelector(isConnectedToHome);
    const regularNode = useSelector(isRegularNode);
    const timelineHref = useTimeline();
    const newsHref = useHomeNews();
    const tinyScreen = useIsTinyScreen();

    const nodeName = connectedToHome ? REL_HOME : REL_CURRENT;
    const href = connectedToHome ? newsHref : (regularNode ? timelineHref : null);
    const logoWidth = tinyScreen ? "3.5rem" : "4.6rem";

    return (
        <div id="logo">
            {href != null ?
                <Jump nodeName={nodeName} href={href}>
                    <LogoImage width={logoWidth}/>
                </Jump>
            :
                <LogoImage width={logoWidth}/>
            }
        </div>
    );
}

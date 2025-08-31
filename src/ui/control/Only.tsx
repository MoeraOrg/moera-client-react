import React from 'react';

import { useIsTinyScreen } from "ui/hook";
import "./Only.css";

interface OnlyDesktopProps {
    children: React.ReactNode;
}

export function OnlyDesktop({children}: OnlyDesktopProps) {
    const tinyScreen = useIsTinyScreen();
    return tinyScreen ? null : <>{children}</>;
}

interface OnlyMobileProps {
    children: React.ReactNode;
}

export function OnlyMobile({children}: OnlyMobileProps) {
    const tinyScreen = useIsTinyScreen();
    return tinyScreen ? <>{children}</> : null;
}

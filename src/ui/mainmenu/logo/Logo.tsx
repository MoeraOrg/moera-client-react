import React from 'react';
import { useSelector } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { useMainMenuHomeNews, useMainMenuTimeline } from "ui/mainmenu/main-menu";
import Jump from "ui/navigation/Jump";
import "./Logo.css";

export default function Logo() {
    const connectedToHome = useSelector(isConnectedToHome);
    const {href: timelineHref} = useMainMenuTimeline();
    const {href: newsHref} = useMainMenuHomeNews();

    const nodeName = connectedToHome ? ":" : "";
    const href = connectedToHome ? newsHref : timelineHref;

    return (
        <div id="logo" className="navbar-brand">
            <Jump nodeName={nodeName} href={href}>
                <img id="logo-image" src="/pics/logo-o-32.png" alt="Moera"/>
            </Jump>
        </div>
    );
}

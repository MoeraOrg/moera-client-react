import React from 'react';

import useMainMenuTimeline from "ui/mainmenu/main-menu-timeline";
import "./Logo.css";

export default function Logo() {
    const {href, onClick} = useMainMenuTimeline();

    return (
        <div id="logo" className="navbar-brand">
            <a href={href} onClick={onClick}>
                <img id="logo-image" src="pics/logo-o-32.png" alt="Moera"/>
            </a>
        </div>
    );
}

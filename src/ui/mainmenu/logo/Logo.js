import React from 'react';

import MainMenuTimelineAccessor from "ui/mainmenu/MainMenuTimelineAccessor";
import "./Logo.css";

const Logo = () => (
    <div id="logo" className="navbar-brand">
        <MainMenuTimelineAccessor>
            {(active, href, onClick) => (
                <a href={href} onClick={onClick}>
                    <img id="logo-image" src="pics/logo-o-32.png" alt="Moera" />
                </a>
            )}
        </MainMenuTimelineAccessor>
    </div>
);

export default Logo;

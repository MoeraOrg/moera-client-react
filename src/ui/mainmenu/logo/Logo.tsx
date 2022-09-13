import React from 'react';
import { useTranslation } from 'react-i18next';

import useMainMenuTimeline from "ui/mainmenu/main-menu-timeline";
import "./Logo.css";

export default function Logo() {
    const {href, onClick} = useMainMenuTimeline();
    const {t} = useTranslation();

    return (
        <div id="logo" className="navbar-brand">
            <a href={href} onClick={onClick}>
                <img id="logo-image" src="pics/logo-o-32.png" alt={t("moera")}/>
            </a>
        </div>
    );
}

import React from 'react';

import MainMenuTimelineLink from "ui/mainmenu/MainMenuTimelineLink";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import MainMenuNewsLink from "ui/mainmenu/MainMenuNewsLink";
import { PAGE_PROFILE } from "state/navigation/pages";

const MainMenuPages = () => (
    <ul className="navbar-nav">
        <MainMenuTimelineLink/>
        <MainMenuLink page={PAGE_PROFILE} href="/profile">PROFILE</MainMenuLink>
        <MainMenuNewsLink/>
    </ul>
);

export default MainMenuPages;

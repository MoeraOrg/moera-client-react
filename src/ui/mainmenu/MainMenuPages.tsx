import React from 'react';
import { useTranslation } from 'react-i18next';

import { PAGE_PEOPLE, PAGE_PROFILE } from "state/navigation/pages";
import MainMenuTimelineLink from "ui/mainmenu/MainMenuTimelineLink";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import MainMenuNewsLink from "ui/mainmenu/MainMenuNewsLink";
import MainMenuComplainsLink from "ui/mainmenu/MainMenuComplainsLink";

const MainMenuPages = () => {
    const {t} = useTranslation();

    return (
        <ul className="navbar-nav">
            <MainMenuTimelineLink/>
            <MainMenuLink page={PAGE_PROFILE} href="/profile">{t("profile")}</MainMenuLink>
            <MainMenuLink page={PAGE_PEOPLE} href="/people">{t("people")}</MainMenuLink>
            <MainMenuNewsLink/>
            <MainMenuComplainsLink/>
        </ul>
    );
}

export default MainMenuPages;

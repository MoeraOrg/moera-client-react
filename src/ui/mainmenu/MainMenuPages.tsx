import React from 'react';
import { useTranslation } from 'react-i18next';
import MainMenuTimelineLink from "ui/mainmenu/MainMenuTimelineLink";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import MainMenuNewsLink from "ui/mainmenu/MainMenuNewsLink";
import MainMenuComplainsLink from "ui/mainmenu/MainMenuComplainsLink";

export default function MainMenuPages() {
    const {t} = useTranslation();

    return (
        <ul className="navbar-nav">
            <MainMenuTimelineLink/>
            <MainMenuLink page="profile" href="/profile">{t("profile")}</MainMenuLink>
            <MainMenuLink page="people" href="/people">{t("people")}</MainMenuLink>
            <MainMenuNewsLink/>
            <MainMenuComplainsLink/>
        </ul>
    );
}

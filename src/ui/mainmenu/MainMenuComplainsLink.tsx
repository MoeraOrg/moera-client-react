import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { getOwnerName } from "state/node/selectors";
import MainMenuLink from "ui/mainmenu/MainMenuLink";

export default function MainMenuComplainsLink() {
    const ownerName = useSelector(getOwnerName);
    const {t} = useTranslation();

    if (ownerName !== SHERIFF_GOOGLE_PLAY_TIMELINE) {
        return null;
    }

    return <MainMenuLink page="complains" href="/complains">{t("complains")}</MainMenuLink>
}

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { getOwnerName } from "state/node/selectors";
import MainMenuLink from "ui/mainmenu/pages/MainMenuLink";

export default function MainMenuComplaintsLink() {
    const ownerName = useSelector(getOwnerName);
    const {t} = useTranslation();

    if (ownerName !== SHERIFF_GOOGLE_PLAY_TIMELINE) {
        return null;
    }

    return <MainMenuLink page="complaints" href="/complaints">{t("complaints")}</MainMenuLink>
}

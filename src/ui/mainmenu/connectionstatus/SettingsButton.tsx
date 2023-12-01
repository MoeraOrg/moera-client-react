import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { isAtSettingsPage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";

export default function SettingsButton() {
    const atSettings = useSelector(isAtSettingsPage);
    const {t} = useTranslation();

    if (atSettings) {
        return (
            <span className="connection-button active" title={t("settings")}><FontAwesomeIcon icon="cog"/></span>
        );
    } else {
        return (
            <Jump nodeName=":" href="/settings" className="connection-button" title={t("settings")}>
                <FontAwesomeIcon icon="cog"/>
            </Jump>
        );
    }
}

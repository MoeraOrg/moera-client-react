import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { isAtSettingsPage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";

export default function SettingsButton() {
    const atSettings = useSelector(isAtSettingsPage);
    const {t} = useTranslation();

    if (atSettings) {
        return (
            <span className="connection-button active" title={t("settings")}><FontAwesomeIcon icon={faCog}/></span>
        );
    } else {
        return (
            <Jump nodeName={REL_HOME} href="/settings" className="connection-button" title={t("settings")}>
                <FontAwesomeIcon icon={faCog}/>
            </Jump>
        );
    }
}

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import "./SheriffVisibility.css";

export function SheriffInvisible() {
    const {t} = useTranslation();

    return (
        <span className="sheriff-visibility" title={t("banned-android-google-play")}>
            <FontAwesomeIcon icon={faEyeSlash}/>
        </span>
    );
}

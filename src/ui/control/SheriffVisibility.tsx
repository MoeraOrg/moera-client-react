import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import "./SheriffVisibility.css";

interface Props {
    invisible: boolean;
}

export function SheriffVisibility({invisible}: Props) {
    const {t} = useTranslation();

    if (!invisible) {
        return null;
    }

    return (
        <span className="sheriff-visibility" title={t("banned-android-google-play")}>
            <FontAwesomeIcon icon="eye-slash"/>
        </span>
    );
}

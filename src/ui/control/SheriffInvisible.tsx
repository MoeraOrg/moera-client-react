import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msVisibilityOff } from "ui/material-symbols";
import "./SheriffVisibility.css";

export function SheriffInvisible() {
    const {t} = useTranslation();

    return (
        <span className="sheriff-visibility" title={t("banned-android-google-play")}>
            <Icon icon={msVisibilityOff} size="1.2em"/>
        </span>
    );
}

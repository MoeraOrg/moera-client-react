import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ReactComponent as NoContent } from "ui/instant/NoContent.isvg";
import "./NoInstants.css";

export default function NoInstants() {
    const {t} = useTranslation();

    return (
        <div className="no-instants">
            <NoContent/>
            <div className="caption">{tTitle(t("no-notifications"))}</div>
            <div className="instructions">{t("you-dont-have-any-notifications")}</div>
        </div>
    );
}

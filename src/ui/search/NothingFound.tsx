import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ReactComponent as NoResult } from "ui/search/NoResult.isvg";
import "./NothingFound.css";

export default function NothingFound() {
    const {t} = useTranslation();

    return (
        <div className="search-nothing-found">
            <NoResult/>
            <div className="caption">{tTitle(t("nothing-found"))}</div>
            <div className="instructions">{t("try-refine-search")}</div>
        </div>
    );
}

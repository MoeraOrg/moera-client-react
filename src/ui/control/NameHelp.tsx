import React from 'react';
import { useTranslation } from 'react-i18next';

export const NameHelp = () => {
    const {t} = useTranslation();

    return (
        <div className="dialog-help">
            {t("name-help") + " "}<b>!</b> <b>*</b> <b>-</b> <b>.</b>
        </div>
    );
}

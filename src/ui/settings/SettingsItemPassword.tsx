import React from 'react';
import { useTranslation } from 'react-i18next';

import * as Browser from "ui/browser";
import Jump from "ui/navigation/Jump";

export default function SettingsItemPassword() {
    const {t} = useTranslation();

    return (
        <Jump href={Browser.urlWithBackHref("/change-password")} className="btn btn-primary">
            {t("change-password")}
        </Jump>
    );
}

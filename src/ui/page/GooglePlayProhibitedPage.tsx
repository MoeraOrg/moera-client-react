import React from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from "ui/page/Page";

export default function GooglePlayProhibitedPage() {
    const {t} = useTranslation();

    return (
        <Page>
            <div className="no-postings">{t("content-not-accessible-android")}</div>
        </Page>
    );
}

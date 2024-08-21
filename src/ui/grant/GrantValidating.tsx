import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingInline } from "ui/control";

export default function GrantValidating() {
    const {t} = useTranslation();

    return (
        <>
            {t("validating-access-request")}<LoadingInline/>
        </>
    );
}

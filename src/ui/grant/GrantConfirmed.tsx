import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";

export default function GrantConfirmed() {
    const {t} = useTranslation();

    const redirectUri = useSelector((state: ClientState) => state.grant.redirectUri);

    return (
        <>
            <h4>{t("access-granted")}</h4>
            <p>
                {redirectUri == null ? t("you-can-close-page") : t("redirecting")}
            </p>
        </>
    );
}

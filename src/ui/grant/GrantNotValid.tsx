import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";

export default function GrantNotValid() {
    const {t} = useTranslation();

    const validationError = useSelector((state: ClientState) => state.grant.validationError);

    return (
        <>
            <h4>{t("access-request-not-valid")}</h4>
            <p>
                {validationError ?? ""}
            </p>
        </>
    );
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { mnemonicDialogOpen } from "state/nodename/actions";
import { hasNodeNameStoredMnemonic } from "state/nodename/selectors";
import { Button } from "ui/control";

export default function SettingsItemMnemonic() {
    const storedMnemonic = useSelector(hasNodeNameStoredMnemonic);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!storedMnemonic) {
        return null;
    }

    return (
        <div className="chapter">
            <div className="title">{t("named-key")}</div>
            <p>
                <Trans i18nKey="write-down-secret-words">
                    <b/>
                </Trans>
            </p>
            <Button variant="primary" onClick={() => dispatch(mnemonicDialogOpen())}>{t("open")}</Button>
        </div>
    );
}

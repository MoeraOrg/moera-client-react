import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsTokensNewTokenClose, settingsTokensNewTokenCopy } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";

export default function NewTokenDialog() {
    const newToken = useSelector((state: ClientState) => state.settings.tokens.dialog.newToken);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (newToken == null) {
        return null;
    }

    const onClose = () => dispatch(settingsTokensNewTokenClose());

    const onCopy = () => dispatch(settingsTokensNewTokenCopy());

    return (
        <ModalDialog title={t("new-token-created")} onClose={onClose}>
            <div className="modal-body">
                <p>
                    {t("you-can-copy-token")}
                </p>
                <p className="text-danger">
                    {t("token-usage-warning")}
                </p>
                <div className="input-group">
                    <input type="text" className="form-control" value={newToken.token} onChange={() => {}}/>
                    <Button variant="secondary" title={t("copy")} onClick={onCopy}>
                        <FontAwesomeIcon icon="copy"/>
                    </Button>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={onClose}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}

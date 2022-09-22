import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsTokensNewTokenClose, settingsTokensNewTokenCopy } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";

type Props = ConnectedProps<typeof connector>;

function NewTokenDialog({newToken, settingsTokensNewTokenClose, settingsTokensNewTokenCopy}: Props) {
    const {t} = useTranslation();

    if (newToken == null) {
        return null;
    }

    return (
        <ModalDialog title={t("new-token-created")} onClose={settingsTokensNewTokenClose}>
            <div className="modal-body">
                <p>
                    {t("you-can-copy-token")}
                </p>
                <p className="text-danger">
                    {t("token-usage-warning")}
                </p>
                <div className="input-group">
                    <input type="text" className="form-control" value={newToken.token} onChange={() => {}}/>
                    <Button variant="secondary" title={t("copy")} onClick={settingsTokensNewTokenCopy}>
                        <FontAwesomeIcon icon="copy"/>
                    </Button>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={settingsTokensNewTokenClose}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        newToken: state.settings.tokens.dialog.newToken
    }),
    { settingsTokensNewTokenClose, settingsTokensNewTokenCopy }
);

export default connector(NewTokenDialog);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { closeMessageBox } from "state/messagebox/actions";
import { ClientState } from "state/state";
import { htmlEntities } from "util/html";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

function MessageBox({show, message, onClose, closeMessageBox, forwardAction}: Props) {
    const {t} = useTranslation();

    if (!show) {
        return null;
    }

    const onCloseClick = () => {
        closeMessageBox();
        if (onClose) {
            if (typeof(onClose) === "function") {
                onClose();
            } else {
                forwardAction(onClose);
            }
        }
    };

    const escapedMessage = htmlEntities(message ?? "")
            .replace("&lt;b&gt;", "<b>") // Only <b></b> tag is allowed
            .replace("&lt;/b&gt;", "</b>");

    return (
        <ModalDialog risen onClose={onClose}>
            <div className="modal-body" dangerouslySetInnerHTML={{__html: escapedMessage}}/>
            <div className="modal-footer">
                <Button variant="primary" onClick={onCloseClick} autoFocus>{t("ok")}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => state.messageBox,
    { closeMessageBox, forwardAction }
);

export default connector(MessageBox);

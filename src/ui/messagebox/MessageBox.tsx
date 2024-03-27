import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeMessageBox } from "state/messagebox/actions";
import { Button, ModalDialog } from "ui/control";
import { htmlEntities } from "util/html";

export default function MessageBox() {
    const message = useSelector((state: ClientState) => state.messageBox.message);
    const onClose = useSelector((state: ClientState) => state.messageBox.onClose);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onCloseClick = () => {
        dispatch(closeMessageBox());
        if (onClose) {
            if (typeof(onClose) === "function") {
                onClose();
            } else {
                dispatch(onClose);
            }
        }
    };

    const escapedMessage = htmlEntities(message ?? "")
            .replace("&lt;b&gt;", "<b>") // Only <b></b> tag is allowed
            .replace("&lt;/b&gt;", "</b>");

    return (
        <ModalDialog onClose={onCloseClick}>
            <div className="modal-body" dangerouslySetInnerHTML={{__html: escapedMessage}}/>
            <div className="modal-footer">
                <Button variant="primary" onClick={onCloseClick} autoFocus>{t("ok")}</Button>
            </div>
        </ModalDialog>
    );
}

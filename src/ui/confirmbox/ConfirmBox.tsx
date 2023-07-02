import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeConfirmBox } from "state/confirmbox/actions";
import { Button, ModalDialog } from "ui/control";
import { htmlEntities } from "util/html";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

function ConfirmBox({
    show, message, yes, no, cancel, onYes, onNo, onCancel, variant, closeConfirmBox, forwardAction
}: Props) {
    const {t} = useTranslation();

    const onClickYes = () => {
        closeConfirmBox();
        if (onYes) {
            if (typeof(onYes) === "function") {
                onYes();
            } else {
                forwardAction(onYes);
            }
        }
    };

    const onClickNo = () => {
        closeConfirmBox();
        if (onNo) {
            if (typeof(onNo) === "function") {
                onNo();
            } else {
                forwardAction(onNo);
            }
        }
    };

    const onClickCancel = () => {
        closeConfirmBox();
        if (onCancel) {
            if (typeof(onCancel) === "function") {
                onCancel();
            } else {
                forwardAction(onCancel);
            }
        }
    };

    if (!show) {
        return null;
    }

    const escapedMessage = htmlEntities(message ?? "")
        .replaceAll("&lt;b&gt;", "<b>") // <b></b> tag is allowed
        .replaceAll("&lt;/b&gt;", "</b>")
        .replaceAll("&lt;br&gt;", "<br>"); // <br> tag is allowed

    return (
        <ModalDialog risen onClose={onCancel != null ? onClickCancel : onClickNo}>
            <div className="modal-body" dangerouslySetInnerHTML={{__html: escapedMessage}}/>
            <div className="modal-footer">
                {onClickCancel &&
                    <Button variant="outline-secondary" onClick={onClickCancel}>{cancel ?? t("cancel")}</Button>
                }
                <Button variant="secondary" onClick={onClickNo}>{no ?? t("no")}</Button>
                <Button variant={variant} onClick={onClickYes} autoFocus>{yes ?? t("yes")}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => state.confirmBox,
    { closeConfirmBox, forwardAction }
);

export default connector(ConfirmBox);

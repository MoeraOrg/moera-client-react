import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeConfirmBox } from "state/confirmbox/actions";
import { Button, ModalDialog } from "ui/control";
import { htmlEntities } from "util/html";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

function ConfirmBox({show, message, yes, no, onYes, onNo, variant, closeConfirmBox, forwardAction}: Props) {
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

    if (!show) {
        return null;
    }

    const escapedMessage = htmlEntities(message ?? "")
        .replace("&lt;b&gt;", "<b>") // Only <b></b> tag is allowed
        .replace("&lt;/b&gt;", "</b>");

    return (
        <ModalDialog risen onClose={onClickNo}>
            <div className="modal-body" dangerouslySetInnerHTML={{__html: escapedMessage}}/>
            <div className="modal-footer">
                <Button variant="secondary" onClick={onClickNo} autoFocus>{no ?? t("no")}</Button>
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

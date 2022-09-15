import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { closeConfirmBox } from "state/confirmbox/actions";
import { Button, ModalDialog } from "ui/control";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

function ConfirmBox({show, message, yes, no, onYes, onNo, variant, closeConfirmBox, forwardAction}: Props) {
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

    return (
        <ModalDialog risen onClose={onClickNo}>
            <div className="modal-body">
                {message}
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={onClickNo} autoFocus>{no}</Button>
                <Button variant={variant} onClick={onClickYes} autoFocus>{yes}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => state.confirmBox,
    { closeConfirmBox, forwardAction }
);

export default connector(ConfirmBox);

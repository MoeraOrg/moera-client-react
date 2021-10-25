import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { closeConfirmBox } from "state/confirmbox/actions";
import { ClientState } from "state/state";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

class ConfirmBox extends React.PureComponent<Props> {

    onYes = () => {
        const {closeConfirmBox, onYes, forwardAction} = this.props;

        closeConfirmBox();
        if (onYes) {
            if (typeof(onYes) === "function") {
                onYes();
            } else {
                forwardAction(onYes);
            }
        }
    };

    onNo = () => {
        const {closeConfirmBox, onNo, forwardAction} = this.props;

        closeConfirmBox();
        if (onNo) {
            if (typeof(onNo) === "function") {
                onNo();
            } else {
                forwardAction(onNo);
            }
        }
    };

    render() {
        const {show, message, yes, no, variant} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog risen onClose={this.onNo}>
                <div className="modal-body">
                    {message}
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={this.onNo} autoFocus>{no}</Button>
                    <Button variant={variant} onClick={this.onYes} autoFocus>{yes}</Button>
                </div>
            </ModalDialog>
        );
    }

}

const connector = connect(
    (state: ClientState) => state.confirmBox,
    { closeConfirmBox, forwardAction }
);

export default connector(ConfirmBox);

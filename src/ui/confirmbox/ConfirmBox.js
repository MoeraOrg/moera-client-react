import React from 'react';
import { connect } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { closeConfirmBox } from "state/confirmbox/actions";

const forwardAction = (action) => action;

class ConfirmBox extends React.PureComponent {

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

        return (
            show &&
            <ModalDialog onClose={this.onNo}>
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

export default connect(
    state => state.confirmBox,
    { closeConfirmBox, forwardAction }
)(ConfirmBox);

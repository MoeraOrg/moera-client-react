import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { closeMessageBox } from "state/messagebox/actions";
import { ClientState } from "state/state";
import { htmlEntities } from "util/html";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

class MessageBox extends React.PureComponent<Props> {

    onClose = () => {
        const {closeMessageBox, onClose, forwardAction} = this.props;

        closeMessageBox();
        if (onClose) {
            if (typeof(onClose) === "function") {
                onClose();
            } else {
                forwardAction(onClose);
            }
        }
    };

    getMessage() {
        return htmlEntities(this.props.message ?? "")
            .replace("&lt;b&gt;", "<b>") // Only <b></b> tag is allowed
            .replace("&lt;/b&gt;", "</b>");
    }

    render() {
        const {show} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog risen={true} onClose={this.onClose}>
                <div className="modal-body" dangerouslySetInnerHTML={{__html: this.getMessage()}}/>
                <div className="modal-footer">
                    <Button variant="primary" onClick={this.onClose} autoFocus>OK</Button>
                </div>
            </ModalDialog>
        );
    }

}

const connector = connect(
    (state: ClientState) => state.messageBox,
    { closeMessageBox, forwardAction }
);

export default connector(MessageBox);

import React from 'react';
import { connect } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { closeMessageBox } from "state/messagebox/actions";
import { htmlEntities } from "util/html";

const forwardAction = (action) => action;

class MessageBox extends React.PureComponent {

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
        return htmlEntities(this.props.message)
            .replace("&lt;b&gt;", "<b>") // Only <b></b> tag is allowed
            .replace("&lt;/b&gt;", "</b>");
    }

    render() {
        const {show} = this.props;

        return (
            show &&
                <ModalDialog onClose={this.onClose}>
                    <div className="modal-body" dangerouslySetInnerHTML={{__html: this.getMessage()}}/>
                    <div className="modal-footer">
                        <Button variant="primary" onClick={this.onClose} autoFocus>OK</Button>
                    </div>
                </ModalDialog>
        );
    }

}

export default connect(
    state => state.messageBox,
    { closeMessageBox, forwardAction }
)(MessageBox);

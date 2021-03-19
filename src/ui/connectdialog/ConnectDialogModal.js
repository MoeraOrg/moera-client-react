import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'formik';

import { cancelConnectDialog } from "state/connectdialog/actions";
import { Button, ModalDialog } from "ui/control";

const ConnectDialogModal = ({title, buttonCaption, children, cancelConnectDialog}) => (
    <ModalDialog title={title} onClose={cancelConnectDialog}>
        <Form>
            <div className="modal-body">
                {children}
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={cancelConnectDialog}>Cancel</Button>
                <Button variant="primary" type="submit">{buttonCaption}</Button>
            </div>
        </Form>
    </ModalDialog>
);

export default connect(
    null,
    { cancelConnectDialog }
)(ConnectDialogModal);

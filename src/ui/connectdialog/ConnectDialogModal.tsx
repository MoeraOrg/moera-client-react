import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form } from 'formik';

import { cancelConnectDialog } from "state/connectdialog/actions";
import { Button, ModalDialog } from "ui/control";
import "./ConnectDialogModal.css";

type Props = {
    title?: string;
    buttonCaption: string;
    loading?: boolean;
    children: ReactNode;
} & ConnectedProps<typeof connector>;

const ConnectDialogModal = ({title, buttonCaption, loading, children, cancelConnectDialog}: Props) => (
    <ModalDialog title={title} className="connect-dialog" onClose={cancelConnectDialog}>
        <Form>
            <div className="modal-body">
                {children}
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={cancelConnectDialog}>Cancel</Button>
                <Button variant="primary" type="submit" loading={loading}>{buttonCaption}</Button>
            </div>
        </Form>
    </ModalDialog>
);

const connector = connect(
    null,
    { cancelConnectDialog }
);

export default connector(ConnectDialogModal);

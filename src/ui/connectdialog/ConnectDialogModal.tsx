import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Form } from 'formik';
import { useTranslation } from 'react-i18next';

import { cancelConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button, ModalDialog } from "ui/control";
import "./ConnectDialogModal.css";

interface Props {
    title?: string;
    buttonCaption: string;
    loading?: boolean;
    children: ReactNode;
}

export default function ConnectDialogModal({title, buttonCaption, loading, children}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onSignUp = () => {
        dispatch(cancelConnectDialog());
        dispatch(openSignUpDialog());
    };

    const onClose = () => dispatch(cancelConnectDialog());

    return (
        <ModalDialog title={title} className="connect-dialog" onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <Button variant="success" className="me-auto" onClick={onSignUp}>{t("sign-up")}</Button>
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={loading}>{buttonCaption}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

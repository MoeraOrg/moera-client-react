import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';

import { dispatch } from "state/store-sagas";
import { mnemonicDelete, mnemonicDialogClose } from "state/nodename/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";
import MnemonicDocument from "ui/profile/manage/MnemonicDocument";
import "./MnemonicDialog.css";

interface Values {
    writtenDown: boolean;
}

function MnemonicDialog() {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onCancel = () => dispatch(mnemonicDialogClose());

    return (
        <ModalDialog title={t("secret-words")} className="mnemonic-dialog" onClose={onCancel}>
            <Form>
                <div className="modal-body">
                    <MnemonicDocument/>
                    <CheckboxField title={t("written-down-words")} name="writtenDown" groupClassName="written-down"
                                   errorsOnly/>
                </div>
                <div className="modal-footer">
                    <Button variant="primary" type="submit">{t("done")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const mnemonicDialogLogic = {

    mapPropsToValues: (): Values => ({
        writtenDown: false
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.writtenDown) {
            errors.writtenDown = "need-write-down-words";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        dispatch(mnemonicDelete());
        dispatch(mnemonicDialogClose());
        formik.setSubmitting(false);
    }

};

export default withFormik(mnemonicDialogLogic)(MnemonicDialog);

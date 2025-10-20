import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { settingsChangePassword, settingsChangePasswordDialogClose } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

interface Values {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

function ChangePasswordDialog() {
    const changing = useSelector((state: ClientState) => state.settings.changingPassword);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(settingsChangePasswordDialogClose());

    return (
        <ModalDialog title={t("change-home-password")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="oldPassword" title={t("current-password")} autoFocus/>
                    <InputField name="password" title={t("new-password")}/>
                    <InputField name="confirmPassword" title={t("confirm-password")}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={changing}>{t("change-password")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const changePasswordLogic = {

    mapPropsToValues: (): Values => ({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.oldPassword.trim()) {
            errors.oldPassword = "must-not-empty";
        }
        if (!values.password) {
            errors.password = "must-not-empty";
        } else if (values.password.length < 8) {
            errors.password = "password-too-short";
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "retype-password";
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "passwords-different";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        dispatch(settingsChangePassword(values.oldPassword.trim(), values.password.trim(),
            () => formik.setFieldError("oldPassword", "password-incorrect")));
        formik.setSubmitting(false);
    }

};

export default withFormik(changePasswordLogic)(ChangePasswordDialog);

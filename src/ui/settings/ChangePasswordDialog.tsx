import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsChangePassword, settingsChangePasswordDialogClose } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";
import store from "state/store";

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

    validationSchema: yup.object().shape({
        oldPassword: yup.string().trim().required("must-not-empty"),
        password: yup.string().required("must-not-empty"),
        confirmPassword: yup.string().when(["password"], ([password]: string[], schema: yup.StringSchema) =>
            schema.required("retype-password").oneOf([password], "passwords-different")
        )
    }),

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        store.dispatch(settingsChangePassword(values.oldPassword.trim(), values.password.trim(),
            () => formik.setFieldError("oldPassword", "password-incorrect")));
        formik.setSubmitting(false);
    }

};

export default withFormik(changePasswordLogic)(ChangePasswordDialog);

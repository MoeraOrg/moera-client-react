import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsChangePassword, settingsChangePasswordDialogClose } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

type Props = OuterProps & FormikProps<Values>;

function ChangePasswordDialog(props: Props) {
    const {show, changing, settingsChangePasswordDialogClose, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: changePasswordLogic.mapPropsToValues()})
        }
    }, [show, resetForm]);

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title={t("change-home-password")} onClose={settingsChangePasswordDialogClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="oldPassword" title={t("current-password")} autoFocus/>
                    <InputField name="password" title={t("new-password")}/>
                    <InputField name="confirmPassword" title={t("confirm-password")}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={settingsChangePasswordDialogClose}>{t("cancel")}</Button>
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

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.settingsChangePassword(values.oldPassword.trim(), values.password.trim(),
            () => formik.setFieldError("oldPassword", "password-incorrect"));
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.settings.changePasswordDialogShow,
        changing: state.settings.changingPassword
    }),
    { settingsChangePassword, settingsChangePasswordDialogClose }
);

export default connector(withFormik(changePasswordLogic)(ChangePasswordDialog));

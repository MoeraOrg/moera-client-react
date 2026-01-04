import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { connectPageChangePassword, connectPageSetForm } from "state/connectpage/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";

interface Values {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

type Props = FormikProps<Values>;

function ChangePasswordForm({dirty, values, errors, resetForm}: Props) {
    const lastError = useSelector((state: ClientState) => state.connectPage.lastError);
    const processing = useSelector((state: ClientState) => state.connectPage.processing);
    const formId = useSelector((state: ClientState) => state.connectPage.formId);
    const {t} = useTranslation();

    useEffect(() => {
        const values = changePasswordLogic.mapPropsToValues();
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]); // 'props' are missing on purpose

    const onForgotPassword = (event: React.MouseEvent) => {
        dispatch(connectPageSetForm(undefined, "admin", "forgot"));
        event.preventDefault();
    }

    const formError = !dirty ? lastError : Object.values(errors).filter(e => e !== "must-not-empty")[0];
    const disabled = !values.oldPassword || !values.password || !values.confirmPassword || processing;

    return (
        <Form>
            <div className="title">{t("change-home-password")}</div>
            <InputField type="password" name="oldPassword" title={t("current-password")} autoComplete="current-password"
                        errorsOnly noFeedback autoFocus/>
            <InputField type="password" name="password" title={t("new-password")} autoComplete="new-password" errorsOnly
                        noFeedback/>
            <InputField type="password" name="confirmPassword" title={t("confirm-password")} autoComplete="new-password"
                        errorsOnly noFeedback/>
            {formError && <div className="form-error">{t(formError)}</div>}
            <Button type="submit" variant="primary" className="submit-button" disabled={disabled} loading={processing}>
                {t("change-password")}
            </Button>
            <div className="link mt-3">
                {t("forgot-password")}{" "}
                <Button variant="link" onClick={onForgotPassword}>{t("reset")}</Button>
            </div>
        </Form>
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
        if (values.password && !values.confirmPassword) {
            errors.confirmPassword = "retype-password";
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "passwords-different";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        dispatch(connectPageChangePassword(values.oldPassword.trim(), values.password.trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(changePasswordLogic)(ChangePasswordForm);

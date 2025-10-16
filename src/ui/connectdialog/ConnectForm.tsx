import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { NamingRules } from "api";
import { tTitle } from "i18n";
import { dispatch } from "state/store-sagas";
import { connectToHome } from "state/home/actions";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { ConnectDialogForm } from "state/connectdialog/state";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import { isUrl } from "util/url";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
}

interface Values {
    location: string;
    password: string;
}

type Props = OuterProps & FormikProps<Values>;

function ConnectForm({values, submitForm}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const setForm = (form: ConnectDialogForm) =>
        dispatch(connectDialogSetForm(values.location, "admin", form));

    const onSignUp = (event: React.MouseEvent) => {
        dispatch(openSignUpDialog());
        event.preventDefault();
    };

    const onForgotPassword = (event: React.MouseEvent) => {
        setForm("forgot");
        event.preventDefault();
    }

    return (
        <Form>
            <div className="title">{t("connect")}</div>
            <InputField name="location" title={tTitle(t("blog-name"))} placeholder={t("enter-blog-name")} errorsOnly
                        autoFocus/>
            <InputField name="password" title={t("password")} placeholder={t("password")} errorsOnly/>
            <Button type="submit" variant="primary" className="submit-button">{t("connect")}</Button>
            <div className="link mt-3">
                {t("forgot-password")}{" "}
                <Button variant="link" onClick={onForgotPassword}>{t("reset")}</Button>
            </div>
            <div className="link mt-3 pt-3">
                {t("dont-have-account")}{" "}
                <Button variant="link" onClick={onSignUp}>{t("sign-up")}</Button>
            </div>
        </Form>
    );
}

const connectFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || "",
        password: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        const location = values.location.trim();
        if (!location) {
            errors.location = "must-not-empty";
        } else if (!isUrl(location) && !NamingRules.isRegisteredNameValid(location)) {
            errors.location = "name-or-node-url-not-valid";
        }
        if (!values.password) {
            errors.password = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(connectToHome(values.location.trim(), false, "admin", values.password));
        formik.setSubmitting(false);
    }

};

export default withFormik(connectFormLogic)(ConnectForm);

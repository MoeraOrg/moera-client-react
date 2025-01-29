import React from 'react';
import { useDispatch } from 'react-redux';
import { FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { NamingRules } from "api";
import { dispatch } from "state/store-sagas";
import { connectToHome } from "state/home/actions";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { ConnectDialogForm } from "state/connectdialog/state";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
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

function ConnectForm({values}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const setForm = (form: ConnectDialogForm) =>
        dispatch(connectDialogSetForm(values.location, "admin", form));

    const onSetPassword = (event: React.MouseEvent) => {
        setForm("assign");
        event.preventDefault();
    }

    const onForgotPassword = (event: React.MouseEvent) => {
        setForm("forgot");
        event.preventDefault();
    }

    return (
        <ConnectDialogModal title={t("connect-home")} buttonCaption={t("connect")}>
            <InputField name="location" title={t("name-or-node-url")} autoFocus/>
            <InputField name="password" title={t("password")}/>
            <div className="links">
                <Button variant="link" onClick={onSetPassword}>{t("password-not-set")}</Button>
                <Button variant="link" onClick={onForgotPassword}>{t("forgot-password")}</Button>
            </div>
        </ConnectDialogModal>
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

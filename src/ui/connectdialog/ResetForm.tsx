import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { connectToHome } from "state/home/actions";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import store from "state/store";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
}

interface Values {
    resetToken: string;
    location: string;
    password: string;
    confirmPassword: string;
}

type Props = OuterProps & FormikProps<Values>;

function ResetForm({values}: Props) {
    const emailHint = useSelector((state: ClientState) => state.connectDialog.emailHint);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onResend = (event: React.MouseEvent) => {
        dispatch(connectDialogSetForm(values.location, "admin", "forgot"));
        event.preventDefault();
    }

    return (
        <ConnectDialogModal title={t("set-home-password")} buttonCaption={t("set-password-and-connect")}>
            {emailHint &&
                <div className="instructions"
                     dangerouslySetInnerHTML={{__html: t("reset-password-hint-instructions", {emailHint})}}/>
            }
            <InputField name="resetToken" title={t("secret-code")} autoFocus/>
            <InputField name="location" title={t("name-or-node-url")}/>
            <InputField name="password" title={t("new-password")}/>
            <InputField name="confirmPassword" title={t("confirm-password")}/>
            <div className="links">
                <button className="btn btn-link" onClick={onResend}>{t("resend-mail")}</button>
            </div>
        </ConnectDialogModal>
    );
}

const resetFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        resetToken: "",
        location: props.location || props.nodeRoot || "",
        password: "",
        confirmPassword: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.resetToken.trim()) {
            errors.resetToken = "must-not-empty";
        }
        if (!values.location.trim()) {
            errors.location = "must-not-empty";
        }
        if (!values.password) {
            errors.password = "must-not-empty";
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "retype-password";
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "passwords-different";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        store.dispatch(connectToHome(values.location.trim(), false, "admin", values.password, null,
            values.resetToken.trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(resetFormLogic)(ResetForm);

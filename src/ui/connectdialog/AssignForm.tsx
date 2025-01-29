import React from 'react';
import { FormikBag, FormikErrors, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { dispatch } from "state/store-sagas";
import { connectToHome } from "state/home/actions";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
}

interface Values {
    location: string;
    password: string;
    confirmPassword: string;
}

function AssignForm() {
    const {t} = useTranslation();

    return (
        <ConnectDialogModal title={t("set-home-password")} buttonCaption={t("set-password-and-connect")}>
            <InputField name="location" title={t("name-or-node-url")} autoFocus/>
            <InputField name="password" title={t("new-password")}/>
            <InputField name="confirmPassword" title={t("confirm-password")}/>
        </ConnectDialogModal>
    );
}

const assignFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || "",
        password: "",
        confirmPassword: ""
    }),


    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

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
        dispatch(connectToHome(values.location.trim(), true, "admin", values.password));
        formik.setSubmitting(false);
    }

};

export default withFormik(assignFormLogic)(AssignForm);

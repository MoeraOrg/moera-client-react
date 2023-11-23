import React from 'react';
import { connect } from 'react-redux';
import { FormikBag, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import store from "state/store";

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

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("must-not-empty"),
        password: yup.string().required("must-not-empty"),
        confirmPassword: yup.string().when(["password"], ([password]: string[], schema: yup.StringSchema) =>
                schema.required("retype-password").oneOf([password], "passwords-different")
        )
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        store.dispatch(connectToHome(values.location.trim(), true, "admin", values.password));
        formik.setSubmitting(false);
    }

};

export default withFormik(assignFormLogic)(AssignForm);

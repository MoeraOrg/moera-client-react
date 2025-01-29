import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { connectDialogResetPassword, connectDialogSetForm } from "state/connectdialog/actions";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
}

interface Values {
    location: string;
}

type Props = OuterProps & FormikProps<Values>;

function ForgotForm({values}: Props) {
    const resettingPassword = useSelector((state: ClientState) => state.connectDialog.resettingPassword);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onMail = (event: React.MouseEvent) => {
        dispatch(connectDialogSetForm(values.location, "admin", "reset"));
        event.preventDefault();
    }

    return (
        <ConnectDialogModal title={t("forgot-home-password")} buttonCaption={t("reset-password")}
                            loading={resettingPassword}>
            <div className="instructions">{t("reset-password-instructions")}</div>
            <InputField name="location" title={t("name-or-node-url")} autoFocus/>
            <div className="links">
                <button className="btn btn-link" onClick={onMail}>{t("received-mail")}</button>
            </div>
        </ConnectDialogModal>
    );
}

const forgotFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.location.trim()) {
            errors.location = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(connectDialogResetPassword(values.location.trim()));
        formik.setSubmitting(false);
    }

};
export default withFormik(forgotFormLogic)(ForgotForm);

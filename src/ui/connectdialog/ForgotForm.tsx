import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { connectDialogResetPassword, connectDialogSetForm } from "state/connectdialog/actions";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import store from "state/store";

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

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("must-not-empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        store.dispatch(connectDialogResetPassword(values.location.trim()));
        formik.setSubmitting(false);
    }

};
export default withFormik(forgotFormLogic)(ForgotForm);

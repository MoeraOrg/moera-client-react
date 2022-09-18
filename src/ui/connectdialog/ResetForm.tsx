import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { connectDialogSetForm } from "state/connectdialog/actions";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    resetToken: string;
    location: string;
    password: string;
    confirmPassword: string;
}

type Props = OuterProps & FormikProps<Values>;

function ResetForm(props: Props) {
    const {show, emailHint, connectDialogSetForm, values, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: resetFormLogic.mapPropsToValues(props)})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose

    const onResend = (event: React.MouseEvent) => {
        connectDialogSetForm(values.location, "admin", "forgot");
        event.preventDefault();
    }

    return (
        <ConnectDialogModal title={t("set-home-password")} buttonCaption={t("set-password-and-connect")}>
            {emailHint &&
                <div className="instructions">
                    <Trans i18nKey="reset-password-hint-instructions" values={{emailHint}}><b/></Trans>
                </div>
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

    validationSchema: yup.object().shape({
        resetToken: yup.string().trim().required("must-not-empty"),
        location: yup.string().trim().required("must-not-empty"),
        password: yup.string().required("must-not-empty"),
        confirmPassword: yup.string().when(["password"], (password, schema) =>
                schema.required("retype-password").oneOf([password], "passwords-different")
        )
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.connectToHome(values.location.trim(), false, "admin", values.password, null,
            values.resetToken.trim());
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.connectDialog.show,
        emailHint: state.connectDialog.emailHint,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { connectToHome, connectDialogSetForm }
);

export default connector(withFormik(resetFormLogic)(ResetForm));

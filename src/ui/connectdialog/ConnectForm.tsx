import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import * as Rules from "api/naming/rules";
import { ClientState } from "state/state";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { cancelConnectDialog, connectDialogSetForm } from "state/connectdialog/actions";
import { ConnectDialogForm } from "state/connectdialog/state";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    location: string;
    password: string;
}

type Props = OuterProps & FormikProps<Values>;

function ConnectForm(props: Props) {
    const {show, connectDialogSetForm, values, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: connectFormLogic.mapPropsToValues(props)})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose

    const setForm = (form: ConnectDialogForm) => {
        connectDialogSetForm(values.location, "admin", form);
    }

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

    validationSchema: yup.object().shape({
        location: yup.string().trim()
            .required("must-not-empty")
            .test(
                "is-allowed",
                "name-or-node-url-not-valid",
                (name: string | undefined) => {
                    if (!name) {
                        return false;
                    }
                    if (/^http[s]?:/.test(name)) {
                        return true;
                    }
                    return Rules.isRegisteredNameValid(name)
                }
            ),
        password: yup.string().required("must-not-empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.connectToHome(values.location.trim(), false, "admin", values.password);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { cancelConnectDialog, connectToHome, connectDialogSetForm }
);

export default connector(withFormik(connectFormLogic)(ConnectForm));

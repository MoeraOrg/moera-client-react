import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { NamingRules } from "api";
import { ClientState } from "state/state";
import { registerName, registerNameDialogCancel } from "state/nodename/actions";
import { Button, ModalDialog, NameHelp } from "ui/control";
import { InputField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    name: string;
}

type Props = OuterProps & FormikProps<Values>;

function RegisterNameDialog({show, registering, registerNameDialogCancel}: Props) {
    const {t} = useTranslation();

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title={t("register-new-name")} onClose={registerNameDialogCancel}>
            <Form>
                <div className="modal-body">
                    <InputField name="name" title={t("name")} autoFocus/>
                    <NameHelp/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={registerNameDialogCancel}
                            disabled={registering}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={registering}>{t("register")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const registerNameDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        name: ""
    }),

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("must-not-empty").max(NamingRules.NAME_MAX_LENGTH)
            .test("is-allowed", "name-not-allowed", NamingRules.isRegisteredNameValid)
    }),

    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.registerName(
            values.name.trim(),
            () => formik.setFieldError("name", "name-already-taken"));
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.nodeName.showingRegisterDialog,
        registering: state.nodeName.registering
    }),
    { registerNameDialogCancel, registerName }
);

export default connector(withFormik(registerNameDialogLogic)(RegisterNameDialog));

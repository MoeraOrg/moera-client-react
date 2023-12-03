import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { NamingRules } from "api";
import { ClientState } from "state/state";
import { registerName, registerNameDialogCancel } from "state/nodename/actions";
import { Button, ModalDialog, NameHelp } from "ui/control";
import { InputField } from "ui/control/field";
import store from "state/store";

interface Values {
    name: string;
}

function RegisterNameDialog() {
    const registering = useSelector((state: ClientState) => state.nodeName.registering);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(registerNameDialogCancel());

    return (
        <ModalDialog title={t("register-new-name")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="name" title={t("name")} autoFocus/>
                    <NameHelp/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}
                            disabled={registering}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={registering}>{t("register")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const registerNameDialogLogic = {

    mapPropsToValues: (): Values => ({
        name: ""
    }),

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("must-not-empty").max(NamingRules.NAME_MAX_LENGTH)
            .test("is-allowed", "name-not-allowed", NamingRules.isRegisteredNameValid)
    }),

    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        store.dispatch(registerName(
            values.name.trim(),
            () => formik.setFieldError("name", "name-already-taken")));
        formik.setSubmitting(false);
    }

};

export default withFormik(registerNameDialogLogic)(RegisterNameDialog);

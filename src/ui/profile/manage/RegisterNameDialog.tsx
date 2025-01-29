import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { NamingRules } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { registerName, registerNameDialogCancel } from "state/nodename/actions";
import { Button, ModalDialog, NameHelp } from "ui/control";
import { InputField } from "ui/control/field";

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

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        const name = values.name.trim();
        if (!name) {
            errors.name = "must-not-empty";
        } else if (name.length > NamingRules.NAME_MAX_LENGTH || !NamingRules.isRegisteredNameValid(name)) {
            errors.name = "name-not-allowed";
        }

        return errors;
    },

    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        dispatch(registerName(
            values.name.trim(),
            () => formik.setFieldError("name", "name-already-taken")));
        formik.setSubmitting(false);
    }

};

export default withFormik(registerNameDialogLogic)(RegisterNameDialog);

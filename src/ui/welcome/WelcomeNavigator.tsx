import React from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { ownerSwitch } from "state/node/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import "./WelcomeNavigator.css";

interface Values {
    ownerName: string;
}

function WelcomeNavigator() {
    const switching = useSelector((state: ClientState) => state.node.owner.switching);
    const {t} = useTranslation();

    return (
        <div id="welcome-navigator">
            <h1>{t("where-go")}</h1>
            <Form className="d-flex justify-content-center">
                <InputField name="ownerName" horizontal autoFocus anyValue placeholder={t("enter-name")}/>
                <Button variant="primary" type="submit" loading={switching}>{t("go")}</Button>
            </Form>
        </div>
    );
}

const welcomeNavigatorLogic = {

    mapPropsToValues: (): Values => ({
        ownerName: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.ownerName.trim()) {
            errors.ownerName = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        dispatch(ownerSwitch(values.ownerName.trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(welcomeNavigatorLogic)(WelcomeNavigator);

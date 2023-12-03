import React from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { ownerSwitch } from "state/node/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import store from "state/store";
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

    validationSchema: yup.object().shape({
        ownerName: yup.string().trim().required("must-not-empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        store.dispatch(ownerSwitch(values.ownerName.trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(welcomeNavigatorLogic)(WelcomeNavigator);

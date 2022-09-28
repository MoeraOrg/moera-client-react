import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { ownerSwitch } from "state/node/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import "./WelcomeNavigator.css";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    ownerName: string;
}

type Props = OuterProps & FormikProps<Values>;

const WelcomeNavigator = ({switching}: Props) => {
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

    mapPropsToValues: (props: OuterProps): Values => ({
        ownerName: ""
    }),

    validationSchema: yup.object().shape({
        ownerName: yup.string().trim().required("must-not-empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.ownerSwitch(values.ownerName.trim());
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        switching: state.node.owner.switching
    }),
    { ownerSwitch }
);

export default connector(withFormik(welcomeNavigatorLogic)(WelcomeNavigator));

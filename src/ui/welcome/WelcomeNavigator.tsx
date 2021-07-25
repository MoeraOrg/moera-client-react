import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { ClientState } from "state/state";
import { ownerSwitch } from "state/owner/actions";
import { InputField } from "ui/control/field";
import { Button } from "ui/control";
import "./WelcomeNavigator.css";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    ownerName: string;
}

type Props = OuterProps & FormikProps<Values>;

const WelcomeNavigator = ({switching}: Props) => (
    <div id="welcome-navigator">
        <h1>Where do you want to go?</h1>
        <Form className="form-inline">
            <InputField name="ownerName" horizontal={true} autoFocus={true} anyValue placeholder="Enter name..."/>
            <Button variant="primary" type="submit" loading={switching}>Go</Button>
        </Form>
    </div>
);

const welcomeNavigatorLogic = {

    mapPropsToValues(props: OuterProps): Values {
        return {
            ownerName: ""
        }
    },

    validationSchema: yup.object().shape({
        ownerName: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.ownerSwitch(values.ownerName.trim());
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        switching: state.owner.switching
    }),
    { ownerSwitch }
);

export default connector(withFormik(welcomeNavigatorLogic)(WelcomeNavigator));

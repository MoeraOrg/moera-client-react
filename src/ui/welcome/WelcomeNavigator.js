import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { ownerSwitch } from "state/owner/actions";
import { InputField } from "ui/control/field";
import { Button } from "ui/control";
import "./WelcomeNavigator.css";

const WelcomeNavigator = ({switching}) => (
    <div id="welcome-navigator">
        <h1>Where do you want to go?</h1>
        <Form className="form-inline">
            <InputField name="ownerName" horizontal={true} autoFocus={true} anyValue placeholder="Enter name..."/>
            <Button variant="primary" type="submit" loading={switching}>Go</Button>
        </Form>
    </div>
);

const welcomeNavigatorLogic = {

    validationSchema: yup.object().shape({
        ownerName: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values, formik) {
        formik.props.ownerSwitch(values.ownerName.trim());
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        switching: state.owner.switching
    }),
    { ownerSwitch }
)(withFormik(welcomeNavigatorLogic)(WelcomeNavigator));

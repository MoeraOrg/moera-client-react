import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { InputField } from "ui/control/field";
import { Button } from "ui/control";
import { ownerSwitch, ownerSwitchClose } from "state/owner/actions";
import { NodeName } from "api";
import "./OwnerNavigator.css";

const OwnerNavigator = ({switching, ownerSwitchClose}) => (
    <Form id="owner-navigator" className="form-inline">
        <div className="gap"/>
        <InputField name="ownerName" horizontal={true} autoFocus={true} anyValue onEscape={ownerSwitchClose}/>
        <Button variant="secondary" type="submit" size="sm" loading={switching}>Go</Button>
        <div className="gap"/>
    </Form>
);

const ownerNavigatorLogic = {

    mapPropsToValues(props) {
        return {
            ownerName: NodeName.shorten(props.ownerName) || ""
        };
    },

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
        ownerName: state.owner.name,
        switching: state.owner.switching
    }),
    { ownerSwitch, ownerSwitchClose }
)(withFormik(ownerNavigatorLogic)(OwnerNavigator));

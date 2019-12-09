import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { InputField } from "ui/control/field";
import { Button } from "ui/control";
import { ownerSwitch, ownerSwitchClose } from "state/owner/actions";
import { isNamingNameLatest } from "state/naming/selectors";
import { NodeName } from "api";

const OwnerNavigator = ({switching, ownerSwitchClose}) => (
    <Form className="form-inline ml-3 mr-3">
        <InputField name="name" horizontal={true} groupClassName="mr-2" autoFocus={true} anyValue
                    onEscape={ownerSwitchClose}/>
        <Button variant="secondary" type="submit" size="sm" loading={switching}>Go</Button>
    </Form>
);

const ownerNavigatorLogic = {

    mapPropsToValues(props) {
        return {
            name: NodeName.shorten(props.ownerName, props.latest) || ""
        };
    },

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values, formik) {
        formik.props.ownerSwitch(values.name.trim());
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        ownerName: state.owner.name,
        latest: isNamingNameLatest(state, state.owner.name),
        switching: state.owner.switching
    }),
    { ownerSwitch, ownerSwitchClose }
)(withFormik(ownerNavigatorLogic)(OwnerNavigator));

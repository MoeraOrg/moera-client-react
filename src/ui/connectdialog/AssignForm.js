import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";
import { cancelConnectDialog } from "state/connectdialog/actions";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";

class AssignForm extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: assignFormLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {cancelConnectDialog} = this.props;

        return (
            <ModalDialog title="Set Home Password" onClose={cancelConnectDialog}>
                <Form>
                    <div className="modal-body">
                        <InputField name="location" title="Name or node URL" autoFocus/>
                        <InputField name="password" title="New password"/>
                        <InputField name="confirmPassword" title="Confirm password"/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={cancelConnectDialog}>Cancel</Button>
                        <Button variant="primary" type="submit">Set Password & Connect</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const assignFormLogic = {

    mapPropsToValues(props) {
        return {
            location: props.location || props.nodeRoot || "",
            password: "",
            confirmPassword: ""
        }
    },

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("Must not be empty"),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when(["password"], (password, schema) =>
                schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values, formik) {
        formik.props.connectToHome(values.location.trim(), true, "admin", values.password);
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { cancelConnectDialog, connectToHome }
)(withFormik(assignFormLogic)(AssignForm));

import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import * as Rules from "api/naming/rules";
import { cancelSignUpDialog, signUp } from "state/signupdialog/actions";
import { Button, ModalDialog, NameHelp } from "ui/control";
import { InputField } from "ui/control/field";
import "./SignUpDialog.css";

class SignUpDialog extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: signUpDialogLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {show, processing, cancelSignUpDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Create a Blog" onClose={cancelSignUpDialog}>
                <Form>
                    <div className="modal-body sign-up-dialog">
                        <InputField name="name" title="Name" autoFocus disabled={processing}/>
                        <NameHelp/>
                        <InputField name="domain" title="Domain" wrapper="domain-group" disabled={processing}/>
                        <InputField name="password" title="New password" disabled={processing}/>
                        <InputField name="confirmPassword" title="Confirm password" disabled={processing}/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={cancelSignUpDialog}>Cancel</Button>
                        <Button variant="primary" type="submit" loading={processing}>Create</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const signUpDialogLogic = {

    mapPropsToValues(props) {
        return {
            password: "",
            confirmPassword: ""
        }
    },

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("Must not be empty").max(Rules.NAME_MAX_LENGTH)
            .test("is-allowed", "Not allowed", Rules.isNameValid),
        domain: yup.string().trim().required("Must not be empty")
            .min(4, "Too short, should be 4 characters at least")
            .lowercase().matches(/^[a-z-][a-z0-9-]+$/, "Not allowed"),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when(["password"],
            (password, schema) =>
                schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values, formik) {
        formik.props.signUp(values.name.trim(), values.domain.trim(), values.password,
            (fieldName, message) => formik.setFieldError(fieldName, message));
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        ...state.signUpDialog
    }),
    { cancelSignUpDialog, signUp }
)(withFormik(signUpDialogLogic)(SignUpDialog));

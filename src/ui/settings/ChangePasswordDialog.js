import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { settingsChangePassword, settingsChangePasswordDialogClose } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

class ChangePasswordDialog extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: changePasswordLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {show, changing, settingsChangePasswordDialogClose} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Change Home Password" onClose={settingsChangePasswordDialogClose}>
                <Form>
                    <div className="modal-body">
                        <InputField name="oldPassword" title="Current password" autoFocus/>
                        <InputField name="password" title="New password"/>
                        <InputField name="confirmPassword" title="Confirm password"/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={this.onClose}>Cancel</Button>
                        <Button variant="primary" type="submit" loading={changing}>Change Password</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const changePasswordLogic = {

    mapPropsToValues(props) {
        return {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        }
    },

    validationSchema: yup.object().shape({
        oldPassword: yup.string().trim().required("Must not be empty"),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when(["password"], (password, schema) =>
            schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values, formik) {
        formik.props.settingsChangePassword(values.oldPassword.trim(), values.password.trim(),
            () => formik.setFieldError("oldPassword", "Password is incorrect"));
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.settings.changePasswordDialogShow,
        changing: state.settings.changingPassword
    }),
    { settingsChangePassword, settingsChangePasswordDialogClose }
)(withFormik(changePasswordLogic)(ChangePasswordDialog));

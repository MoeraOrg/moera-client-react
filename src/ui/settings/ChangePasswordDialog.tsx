import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { ClientState } from "state/state";
import { settingsChangePassword, settingsChangePasswordDialogClose } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

type Props = OuterProps & FormikProps<Values>;

function ChangePasswordDialog(props: Props) {
    const {show, changing, settingsChangePasswordDialogClose, resetForm} = props;

    useEffect(() => {
        if (show) {
            resetForm({values: changePasswordLogic.mapPropsToValues(props)})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose

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
                    <Button variant="secondary" onClick={settingsChangePasswordDialogClose}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={changing}>Change Password</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const changePasswordLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    }),

    validationSchema: yup.object().shape({
        oldPassword: yup.string().trim().required("Must not be empty"),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when(["password"], (password, schema) =>
            schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.settingsChangePassword(values.oldPassword.trim(), values.password.trim(),
            () => formik.setFieldError("oldPassword", "Password is incorrect"));
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.settings.changePasswordDialogShow,
        changing: state.settings.changingPassword
    }),
    { settingsChangePassword, settingsChangePasswordDialogClose }
);

export default connector(withFormik(changePasswordLogic)(ChangePasswordDialog));

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { Button, ModalDialog, NameHelp } from "ui/control";
import { InputField } from "ui/control/field";
import { registerName, registerNameDialogCancel } from "state/nodename/actions";
import { ClientState } from "state/state";
import * as Rules from "api/naming/rules";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    name: string;
}

type Props = OuterProps & FormikProps<Values>;

function RegisterNameDialog({show, registering, registerNameDialogCancel}: Props) {
    if (!show) {
        return null;
    }

    return (
        <ModalDialog title="Register a New Name" onClose={registerNameDialogCancel}>
            <Form>
                <div className="modal-body">
                    <InputField name="name" title="Name" autoFocus/>
                    <NameHelp/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={registerNameDialogCancel}
                            disabled={registering}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={registering}>Register</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const registerNameDialogLogic = {

    mapPropsToValues(props: OuterProps): Values {
        return {
            name: ""
        }
    },

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("Must not be empty").max(Rules.NAME_MAX_LENGTH)
            .test("is-allowed", "Name is not allowed", Rules.isRegisteredNameValid)
    }),

    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.registerName(
            values.name.trim(),
            () => formik.setFieldError("name", "Name is already taken"));
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.nodeName.showingRegisterDialog,
        registering: state.nodeName.registering
    }),
    { registerNameDialogCancel, registerName }
);

export default connector(withFormik(registerNameDialogLogic)(RegisterNameDialog));

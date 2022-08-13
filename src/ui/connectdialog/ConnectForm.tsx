import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import { cancelConnectDialog, connectDialogSetForm } from "state/connectdialog/actions";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { ClientState } from "state/state";
import { ConnectDialogForm } from "state/connectdialog/state";
import * as Rules from "api/naming/rules";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    location: string;
    password: string;
}

type Props = OuterProps & FormikProps<Values>;

function ConnectForm(props: Props) {
    const {show, connectDialogSetForm, values, resetForm} = props;

    useEffect(() => {
        if (show) {
            resetForm({values: connectFormLogic.mapPropsToValues(props)})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose

    const setForm = (form: ConnectDialogForm) => {
        connectDialogSetForm(values.location, "admin", form);
    }

    const onSetPassword = (event: React.MouseEvent) => {
        setForm("assign");
        event.preventDefault();
    }

    const onForgotPassword = (event: React.MouseEvent) => {
        setForm("forgot");
        event.preventDefault();
    }

    return (
        <ConnectDialogModal title="Connect to Home" buttonCaption="Connect">
            <InputField name="location" title="Name or node URL" autoFocus/>
            <InputField name="password" title="Password"/>
            <div className="links">
                <Button variant="link" onClick={onSetPassword}>Password not set yet</Button>
                <Button variant="link" onClick={onForgotPassword}>Forgot password</Button>
            </div>
        </ConnectDialogModal>
    );
}

const connectFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || "",
        password: ""
    }),

    validationSchema: yup.object().shape({
        location: yup.string().trim()
            .required("Must not be empty")
            .test(
                "is-allowed",
                "Name or node URL is not valid",
                (name: string | undefined) => {
                    if (!name) {
                        return false;
                    }
                    if (/^http[s]?:/.test(name)) {
                        return true;
                    }
                    return Rules.isRegisteredNameValid(name)
                }
            ),
        password: yup.string().required("Must not be empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.connectToHome(values.location.trim(), false, "admin", values.password);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { cancelConnectDialog, connectToHome, connectDialogSetForm }
);

export default connector(withFormik(connectFormLogic)(ConnectForm));

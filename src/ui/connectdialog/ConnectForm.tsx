import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import { cancelConnectDialog, ConnectDialogForm, connectDialogSetForm } from "state/connectdialog/actions";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { ClientState } from "state/state";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    location: string;
    password: string;
}

type Props = OuterProps & FormikProps<Values>;

class ConnectForm extends React.PureComponent<Props> {

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: connectFormLogic.mapPropsToValues(this.props),
            });
        }
    }

    setForm(form: ConnectDialogForm) {
        const {location} = this.props.values;
        const {connectDialogSetForm} = this.props;

        connectDialogSetForm(location, "admin", form);
    }

    onSetPassword = (event: React.MouseEvent) => {
        this.setForm("assign");
        event.preventDefault();
    }

    onForgotPassword = (event: React.MouseEvent) => {
        this.setForm("forgot");
        event.preventDefault();
    }

    render() {
        return (
            <ConnectDialogModal title="Connect to Home" buttonCaption="Connect">
                <InputField name="location" title="Name or node URL" autoFocus/>
                <InputField name="password" title="Password"/>
                <div className="links">
                    <Button variant="link" onClick={this.onSetPassword}>Password not set yet</Button>
                    <Button variant="link" onClick={this.onForgotPassword}>Forgot password</Button>
                </div>
            </ConnectDialogModal>
        );
    }

}

const connectFormLogic = {

    mapPropsToValues(props: OuterProps): Values {
        return {
            location: props.location || props.nodeRoot || "",
            password: ""
        }
    },

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("Must not be empty"),
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

import React from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import { cancelConnectDialog, connectDialogSetForm } from "state/connectdialog/actions";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

class ConnectForm extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: connectFormLogic.mapPropsToValues(this.props),
            });
        }
    }

    setForm(form) {
        const {location, login} = this.props.values;
        const {connectDialogSetForm} = this.props;

        connectDialogSetForm(location, login, form);
    }

    onSetPassword = event => {
        this.setForm("assign");
        event.preventDefault();
    }

    onForgotPassword = event => {
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

    mapPropsToValues(props) {
        return {
            location: props.location || props.nodeRoot || "",
            password: ""
        }
    },

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("Must not be empty"),
        password: yup.string().required("Must not be empty")
    }),

    handleSubmit(values, formik) {
        formik.props.connectToHome(values.location.trim(), false, "admin", values.password);
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { cancelConnectDialog, connectToHome, connectDialogSetForm }
)(withFormik(connectFormLogic)(ConnectForm));

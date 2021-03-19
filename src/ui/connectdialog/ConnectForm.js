import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";
import { cancelConnectDialog, connectDialogSetForm } from "state/connectdialog/actions";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";

class ConnectForm extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: connectFormLogic.mapPropsToValues(this.props),
            });
        }
    }

    onSetPassword = event => {
        const {location, login} = this.props.values;
        const {connectDialogSetForm} = this.props;

        connectDialogSetForm(location, login, "assign");

        event.preventDefault();
    }

    render() {
        const {cancelConnectDialog} = this.props;

        return (
            <ModalDialog title="Connect to Home" onClose={cancelConnectDialog}>
                <Form>
                    <div className="modal-body">
                        <InputField name="location" title="Name or node URL" autoFocus/>
                        <InputField name="password" title="Password"/>
                        <button className="btn btn-link" onClick={this.onSetPassword}>Password not set yet</button>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={cancelConnectDialog}>Cancel</Button>
                        <Button variant="primary" type="submit">Connect</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const connectFormLogic = {

    mapPropsToValues(props) {
        return {
            location: props.location || props.nodeRoot || "",
            password: "",
            confirmPassword: ""
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

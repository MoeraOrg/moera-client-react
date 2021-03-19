import React from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { InputField } from "ui/control/field";
import { cancelConnectDialog, connectDialogResetPassword, connectDialogSetForm } from "state/connectdialog/actions";
import { getNodeRootLocation } from "state/node/selectors";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

class ForgotForm extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: forgotFormLogic.mapPropsToValues(this.props),
            });
        }
    }

    onMail = event => {
        const {location, login} = this.props.values;
        const {connectDialogSetForm} = this.props;

        connectDialogSetForm(location, login, "mail");

        event.preventDefault();
    }

    render() {
        const {resettingPassword} = this.props;

        return (
            <ConnectDialogModal title="Forgot Home Password" buttonCaption="Reset Password" loading={resettingPassword}>
                <div className="instructions">
                    To reset the password, please enter the name or the URL of your home node.
                </div>
                <InputField name="location" title="Name or node URL" autoFocus/>
                <div className="links">
                    <button className="btn btn-link" onClick={this.onMail}>Received the mail already</button>
                </div>
            </ConnectDialogModal>
        );
    }

}

const forgotFormLogic = {

    mapPropsToValues(props) {
        return {
            location: props.location || props.nodeRoot || ""
        }
    },

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values, formik) {
        formik.props.connectDialogResetPassword(values.location.trim());
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        resettingPassword: state.connectDialog.resettingPassword,
        nodeRoot: getNodeRootLocation(state)
    }),
    { cancelConnectDialog, connectDialogSetForm, connectDialogResetPassword }
)(withFormik(forgotFormLogic)(ForgotForm));

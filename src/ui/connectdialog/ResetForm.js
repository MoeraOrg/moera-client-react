import React from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { InputField } from "ui/control/field";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";

class ResetForm extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: resetFormLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {emailHint} = this.props;

        return (
            <ConnectDialogModal title="Set Home Password" buttonCaption="Set Password & Connect">
                {emailHint &&
                    <div className="instructions">
                        A message was sent to your E-mail address <b>{emailHint}</b> with a secret code needed to reset
                        the password. Please enter it in the field below.
                    </div>
                }
                <InputField name="token" title="Secret code" autoFocus/>
                <InputField name="location" title="Name or node URL"/>
                <InputField name="password" title="New password"/>
                <InputField name="confirmPassword" title="Confirm password"/>
            </ConnectDialogModal>
        );
    }

}

const resetFormLogic = {

    mapPropsToValues(props) {
        return {
            token: "",
            location: props.location || props.nodeRoot || "",
            password: "",
            confirmPassword: ""
        }
    },

    validationSchema: yup.object().shape({
        token: yup.string().trim().required("Must not be empty"),
        location: yup.string().trim().required("Must not be empty"),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when(["password"], (password, schema) =>
                schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values, formik) {
        // formik.props.connectToHome(values.location.trim(), true, "admin", values.password);
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.connectDialog.show,
        emailHint: state.connectDialog.emailHint,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { connectToHome }
)(withFormik(resetFormLogic)(ResetForm));

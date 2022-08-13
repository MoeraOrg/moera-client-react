import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import { cancelConnectDialog, connectDialogResetPassword, connectDialogSetForm } from "state/connectdialog/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { ClientState } from "state/state";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    location: string;
}

type Props = OuterProps & FormikProps<Values>;

function ForgotForm(props: Props) {
    const {show, resettingPassword, connectDialogSetForm, values, resetForm} = props;

    useEffect(() => {
        if (show) {
            resetForm({values: forgotFormLogic.mapPropsToValues(props)})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose

    const onMail = (event: React.MouseEvent) => {
        connectDialogSetForm(values.location, "admin", "reset");
        event.preventDefault();
    }

    return (
        <ConnectDialogModal title="Forgot Home Password" buttonCaption="Reset Password" loading={resettingPassword}>
            <div className="instructions">
                To reset the password, please enter the name or the URL of your home node.
            </div>
            <InputField name="location" title="Name or node URL" autoFocus/>
            <div className="links">
                <button className="btn btn-link" onClick={onMail}>Received the mail already</button>
            </div>
        </ConnectDialogModal>
    );
}

const forgotFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || ""
    }),

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.connectDialogResetPassword(values.location.trim());
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        resettingPassword: state.connectDialog.resettingPassword,
        nodeRoot: getNodeRootLocation(state)
    }),
    { cancelConnectDialog, connectDialogSetForm, connectDialogResetPassword }
);

export default connector(withFormik(forgotFormLogic)(ForgotForm));

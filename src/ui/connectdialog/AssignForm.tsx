import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { InputField } from "ui/control/field";
import ConnectDialogModal from "ui/connectdialog/ConnectDialogModal";
import { connectToHome } from "state/home/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { ClientState } from "state/state";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    location: string;
    password: string;
    confirmPassword: string;
}

type Props = OuterProps & FormikProps<Values>;

function AssignForm(props: Props) {
    const {show, resetForm} = props;

    useEffect(() => {
        if (show) {
            resetForm({values: assignFormLogic.mapPropsToValues(props)})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose


    return (
        <ConnectDialogModal title="Set Home Password" buttonCaption="Set Password & Connect">
            <InputField name="location" title="Name or node URL" autoFocus/>
            <InputField name="password" title="New password"/>
            <InputField name="confirmPassword" title="Confirm password"/>
        </ConnectDialogModal>
    );
}

const assignFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || "",
        password: "",
        confirmPassword: ""
    }),

    validationSchema: yup.object().shape({
        location: yup.string().trim().required("Must not be empty"),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when(["password"], (password, schema) =>
                schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.connectToHome(values.location.trim(), true, "admin", values.password);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.connectDialog.show,
        location: state.connectDialog.location,
        nodeRoot: getNodeRootLocation(state)
    }),
    { connectToHome }
);

export default connector(withFormik(assignFormLogic)(AssignForm));

import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

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

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: assignFormLogic.mapPropsToValues(props)})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, resetForm]); // 'props' are missing on purpose


    return (
        <ConnectDialogModal title={t("set-home-password")} buttonCaption={t("set-password-and-connect")}>
            <InputField name="location" title={t("name-or-node-url")} autoFocus/>
            <InputField name="password" title={t("new-password")}/>
            <InputField name="confirmPassword" title={t("confirm-password")}/>
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
        location: yup.string().trim().required("must-not-empty"),
        password: yup.string().required("must-not-empty"),
        confirmPassword: yup.string().when(["password"], ([password]: string[], schema: yup.StringSchema) =>
                schema.required("retype-password").oneOf([password], "passwords-different")
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

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { connectToHome } from "state/home/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import { useWaitTill } from "ui/connectpage/wait-till";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
    resetToken: string;
}

interface Values {
    password: string;
    confirmPassword: string;
}

type Props = OuterProps & FormikProps<Values>;

function ResetForm({dirty, values, resetForm}: Props) {
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const lastError = useSelector((state: ClientState) => state.connectPage.lastError);
    const connectAfter = useSelector((state: ClientState) => state.connectPage.connectAfter);
    const waitConnect = useWaitTill(connectAfter);
    const formId = useSelector((state: ClientState) => state.connectPage.formId);
    const {t} = useTranslation();

    useEffect(() => {
        const values = resetFormLogic.mapPropsToValues();
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]); // 'props' are missing on purpose

    const formError = !dirty ? lastError : undefined;
    const disabled = !values.password || values.password !== values.confirmPassword || connecting;

    return (
        <Form>
            <div className="title">{tTitle(t("create-new-password"))}</div>
            <div className="instructions">{t("new-password-instructions")}</div>
            <div className="password-hint">{t("new-password-hint-instructions")}</div>
            <InputField name="password" title={tTitle(t("password"))} errorsOnly noFeedback autoFocus/>
            <InputField name="confirmPassword" title={tTitle(t("confirm-password"))} errorsOnly noFeedback/>
            {formError && <div className="form-error">{t(formError)}</div>}
            <Button type="submit" variant="primary" className="submit-button" disabled={disabled} loading={connecting}>
                {`${t("reset-password")} ${waitConnect}`}
            </Button>
        </Form>
    );
}

const resetFormLogic = {

    mapPropsToValues: (): Values => ({
        password: "",
        confirmPassword: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.password) {
            errors.password = "must-not-empty";
        } else if (values.password.length < 8) {
            errors.password = "password-too-short";
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "retype-password";
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "passwords-different";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const location = formik.props.location || formik.props.nodeRoot || "";
        dispatch(connectToHome(location, false, "admin", values.password, null, formik.props.resetToken));
        formik.setSubmitting(false);
    }

};

export default withFormik(resetFormLogic)(ResetForm);

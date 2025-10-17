import React from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { connectDialogResetPassword } from "state/connectdialog/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
}

interface Values {
    location: string;
}

type Props = OuterProps & FormikProps<Values>;

function ForgotForm({values}: Props) {
    const resettingPassword = useSelector((state: ClientState) => state.connectDialog.resettingPassword);
    const {t} = useTranslation();

    const disabled = !values.location || resettingPassword;

    return (
        <Form>
            <div className="title">{tTitle(t("password-recovery"))}</div>
            <div className="instructions"><Trans i18nKey="reset-password-instructions"/></div>
            <InputField name="location" title={tTitle(t("blog-name"))} placeholder={t("enter-blog-name")} errorsOnly
                        noFeedback autoFocus/>
            <Button type="submit" variant="primary" className="submit-button" disabled={disabled}
                    loading={resettingPassword}>
                {t("reset-password")}
            </Button>
        </Form>
    );
}

const forgotFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || props.nodeRoot || ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.location.trim()) {
            errors.location = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(connectDialogResetPassword(values.location.trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(forgotFormLogic)(ForgotForm);

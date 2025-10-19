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

function ForgotForm({location, values, dirty}: Props) {
    const processing = useSelector((state: ClientState) => state.connectDialog.processing);
    const lastError = useSelector((state: ClientState) => state.connectDialog.lastError);
    const {t} = useTranslation();

    const formError = !dirty ? lastError : undefined;
    const disabled = !values.location || processing;

    return (
        <Form>
            <div className="title">{tTitle(t("password-recovery"))}</div>
            <div className="instructions"><Trans i18nKey="reset-password-instructions"/></div>
            <InputField name="location" title={tTitle(t("blog-name"))} placeholder={t("enter-blog-name")} errorsOnly
                        noFeedback autoFocus/>
            {formError && <div className="form-error">{t(formError, {location})}</div>}
            <Button type="submit" variant="primary" className="submit-button" disabled={disabled} loading={processing}>
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

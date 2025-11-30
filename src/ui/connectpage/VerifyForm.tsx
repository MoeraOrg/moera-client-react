import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { connectPageResetPassword, connectPageVerifyCode } from "state/connectpage/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import { useWaitTill } from "ui/connectpage/wait-till";

interface OuterProps {
    location: string;
    nodeRoot: string | null;
}

interface Values {
    resetToken: string;
}

type Props = OuterProps & FormikProps<Values>;

function VerifyForm({location, nodeRoot, values, dirty, resetForm}: Props) {
    const emailHint = useSelector((state: ClientState) => state.connectPage.emailHint);
    const processing = useSelector((state: ClientState) => state.connectPage.processing);
    const lastError = useSelector((state: ClientState) => state.connectPage.lastError);
    const mailAfter = useSelector((state: ClientState) => state.connectPage.mailAfter);
    const waitMail = useWaitTill(mailAfter);
    const formId = useSelector((state: ClientState) => state.connectPage.formId);
    const {t} = useTranslation();

    useEffect(() => {
        const values = verifyFormLogic.mapPropsToValues();
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]); // 'props' are missing on purpose

    const onTryAgain = (event: React.MouseEvent) => {
        const target = location || nodeRoot || "";
        dispatch(connectPageResetPassword(target));
        event.preventDefault();
    }

    const formError = !dirty ? lastError : undefined;
    const disabled = !values.resetToken || processing;

    return (
        <Form>
            <div className="title">{tTitle(t("password-recovery"))}</div>
            <div className="hint">
                <Trans i18nKey="reset-password-hint-instructions" values={{emailHint}}><b/></Trans>
            </div>
            <InputField name="resetToken" title={tTitle(t("verification-code"))}
                        placeholder={t("enter-verification-code")} errorsOnly noFeedback autoFocus/>
            {formError && <div className="form-error">{t(formError)}</div>}
            <Button type="submit" variant="primary" className="submit-button" disabled={disabled} loading={processing}>
                {t("reset-password")}
            </Button>
            <div className="link mt-3">
                {t("not-received-email")}{" "}
                {waitMail ?
                    waitMail
                :
                    <Button variant="link" onClick={onTryAgain}>{tTitle(t("try-again"))}</Button>
                }
            </div>
        </Form>
    );
}

const verifyFormLogic = {

    mapPropsToValues: (): Values => ({
        resetToken: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.resetToken.trim()) {
            errors.resetToken = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const location = formik.props.location || formik.props.nodeRoot || "";
        dispatch(connectPageVerifyCode(location, values.resetToken.toUpperCase().trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(verifyFormLogic)(VerifyForm);

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { NamingRules } from "api";
import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { connectToHome } from "state/home/actions";
import { connectPageSetForm } from "state/connectpage/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import Jump from "ui/navigation/Jump";
import { useWaitTill } from "ui/connectpage/wait-till";
import { isUrl, urlWithParameters } from "util/url";

interface OuterProps {
    location: string;
}

interface Values {
    location: string;
    password: string;
}

type Props = OuterProps & FormikProps<Values>;

function ConnectForm(props: Props) {
    const {values, dirty, resetForm} = props;

    const lastError = useSelector((state: ClientState) => state.connectPage.lastError);
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connectAfter = useSelector((state: ClientState) => state.connectPage.connectAfter);
    const waitConnect = useWaitTill(connectAfter);
    const formId = useSelector((state: ClientState) => state.connectPage.formId);
    const backHref = useSelector((state: ClientState) => state.connectPage.backHref);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        const values = connectFormLogic.mapPropsToValues(props);
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]); // 'props' are missing on purpose

    const onForgotPassword = (event: React.MouseEvent) => {
        dispatch(connectPageSetForm(values.location, "admin", "forgot"));
        event.preventDefault();
    }

    const formError = !dirty ? lastError : undefined;
    const disabled = !values.location || !values.password || !isLocationValid(values.location) || connecting
        || !!waitConnect;

    return (
        <Form>
            <div className="title">{t("connect")}</div>
            <InputField name="location" title={tTitle(t("blog-name"))} placeholder={t("enter-blog-name")} errorsOnly
                        noFeedback error={formError} autoFocus/>
            <InputField type="password" name="password" title={t("password")} placeholder={t("password")} errorsOnly
                        noFeedback error={formError}/>
            {formError && <div className="form-error">{t(formError)}</div>}
            <Button type="submit" variant="primary" className="submit-button" disabled={disabled} loading={connecting}>
                {`${t("connect")} ${waitConnect}`}
            </Button>
            <div className="link mt-3">
                {t("forgot-password")}{" "}
                <Button variant="link" onClick={onForgotPassword}>{t("reset")}</Button>
            </div>
            <div className="link mt-3 pt-3">
                {t("dont-have-account")}{" "}
                <Jump className="btn btn-link" href={urlWithParameters("/signup", {back: backHref})}>
                    {t("sign-up")}
                </Jump>
            </div>
        </Form>
    );
}

function isLocationValid(location: string) {
    return isUrl(location) || NamingRules.isRegisteredNameValid(location);
}

const connectFormLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        location: props.location || "",
        password: ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        const location = values.location.trim();
        if (!location) {
            errors.location = "must-not-empty";
        } else if (!isLocationValid(location)) {
            errors.location = "name-or-node-url-not-valid";
        }
        if (!values.password) {
            errors.password = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(connectToHome(values.location.trim(), false, "admin", values.password));
        formik.setSubmitting(false);
    }

};

export default withFormik(connectFormLogic)(ConnectForm);

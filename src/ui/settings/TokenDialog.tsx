import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsTokensCreate, settingsTokensDialogClose, settingsTokensUpdate } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    name: string;
    password: string;
}

type Props = OuterProps & FormikProps<Values>;

function TokenDialog(props: Props) {
    const {token, updating, settingsTokensDialogClose, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        resetForm({values: tokenLogic.mapPropsToValues(props)})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetForm]); // 'props' are missing on purpose

    return (
        <ModalDialog title={token == null ? t("create-token") : t("rename-token")} onClose={settingsTokensDialogClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="name" title={t("token-name")} autoFocus/>
                    {token == null &&
                        <InputField name="password" title={t("your-password")}/>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={settingsTokensDialogClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={updating}>
                        {token == null ? t("create") : t("rename")}
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const tokenLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        name: props.token?.name ?? "",
        password: ""
    }),

    validationSchema: (props: OuterProps) =>
        yup.object().shape(props.token == null ? {
            password: yup.string().required("must-not-empty")
        } : {}),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        let name: string | null = values.name.trim();
        name = name.length > 0 ? name : null;
        if (formik.props.token == null) {
            formik.props.settingsTokensCreate(values.password.trim(), name,
                () => formik.setFieldError("password", "password-incorrect"));
        } else {
            formik.props.settingsTokensUpdate(formik.props.token.id, name);
        }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        token: state.settings.tokens.dialog.token,
        updating: state.settings.tokens.dialog.updating
    }),
    { settingsTokensDialogClose, settingsTokensCreate, settingsTokensUpdate }
);

export default connector(withFormik(tokenLogic)(TokenDialog));

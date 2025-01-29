import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { Scope, TokenInfo } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { settingsTokensCreate, settingsTokensDialogClose, settingsTokensUpdate } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";
import PermissionSelector from "ui/settings/PermissionSelector";

interface OuterProps {
    token: TokenInfo | null;
}

interface Values {
    name: string;
    password: string;
    scopes: Scope[];
}

type Props = OuterProps & FormikProps<Values>;

function TokenDialogInner({token}: Props) {
    const updating = useSelector((state: ClientState) => state.settings.tokens.dialog.updating);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(settingsTokensDialogClose());

    return (
        <ModalDialog title={token == null ? t("create-token") : t("rename-token")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="name" title={t("token-name")} autoFocus/>
                    {token == null &&
                        <InputField name="password" title={t("your-password")}/>
                    }
                    <PermissionSelector title={t("permissions")} name="scopes" enabledPermissions={token?.permissions}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={updating}>
                        {token == null ? t("create") : t("change")}
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const tokenLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        name: props.token?.name ?? "",
        password: "",
        scopes: props.token?.permissions ?? []
    }),

    validate: (values: Values, props: OuterProps): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (props.token == null && !values.password) {
            errors.password = "must-not-empty";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        let name: string | null = values.name.trim();
        name = name.length > 0 ? name : null;
        if (formik.props.token == null) {
            dispatch(settingsTokensCreate(
                values.password.trim(), name, values.scopes,
                () => formik.setFieldError("password", "password-incorrect")
            ));
        } else {
            dispatch(settingsTokensUpdate(formik.props.token.id, name, values.scopes));
        }
        formik.setSubmitting(false);
    }

};

const TokenDialogOuter = withFormik(tokenLogic)(TokenDialogInner);

export default function TokenDialog() {
    const token = useSelector((state: ClientState) => state.settings.tokens.dialog.token);

    return <TokenDialogOuter token={token}/>;
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { Scope, SCOPES, SCOPES_VIEW_ALL, TokenInfo } from "api";
import { ClientState } from "state/state";
import { settingsTokensCreate, settingsTokensDialogClose, settingsTokensUpdate } from "state/settings/actions";
import { Button, Checkbox, FormGroup, ModalDialog } from "ui/control";
import { CheckboxField, InputField } from "ui/control/field";
import store from "state/store";
import "./TokenDialog.css";

const SCOPES_VIEW_ALL_SET = new Set(SCOPES_VIEW_ALL);

interface OuterProps {
    token: TokenInfo | null;
}

interface Values {
    name: string;
    password: string;
    scopes: Scope[];
}

type Props = OuterProps & FormikProps<Values>;

function TokenDialogInner({token, values, setFieldValue}: Props) {
    const updating = useSelector((state: ClientState) => state.settings.tokens.dialog.updating);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(settingsTokensDialogClose());

    const scopeAllChecked = values.scopes.length === SCOPES.length ? true : (values.scopes.length === 0 ? false : null);

    const onScopeAllChange = () => setFieldValue("scopes", scopeAllChecked ? [] : SCOPES);

    const scopesSet = new Set(values.scopes);

    // @ts-ignore
    const scopeViewAllChecked = scopesSet.isSupersetOf(SCOPES_VIEW_ALL_SET)
            ? true
            // @ts-ignore
            : (scopesSet.intersection(SCOPES_VIEW_ALL_SET).size === 0 ? false : null);

    const onScopeViewAllChange = () =>
        setFieldValue(
            "scopes",
            scopeViewAllChecked
                ? values.scopes.filter(sc => !SCOPES_VIEW_ALL_SET.has(sc))
                : values.scopes.concat(SCOPES_VIEW_ALL)
        );

    return (
        <ModalDialog title={token == null ? t("create-token") : t("rename-token")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="name" title={t("token-name")} autoFocus/>
                    {token == null &&
                        <InputField name="password" title={t("your-password")}/>
                    }
                    <div className="mb-2">{t("permissions")}</div>
                    <fieldset className="permission-checkboxes">
                        <FormGroup title={t("scope.all")} layout="right" groupClassName="mb-0"
                                   labelClassName="text-danger">
                            <Checkbox name="scopes" className="form-check-input" checked={scopeAllChecked}
                                      onChange={onScopeAllChange}/>
                        </FormGroup>
                        <FormGroup title={t("scope.view-all")} layout="right">
                            <Checkbox name="scopes" className="form-check-input" checked={scopeViewAllChecked}
                                      onChange={onScopeViewAllChange}/>
                        </FormGroup>
                        {SCOPES.map(sc =>
                            <CheckboxField<Scope[]> key={sc} id={`scope_${sc}`} name="scopes" value={sc}
                                                    title={t(`scope.${sc}`)} groupClassName="mb-0"
                                                    isChecked={(v: string[]) => v.includes(sc)} anyValue/>
                        )}
                    </fieldset>
                </div>
                <div className="modal-footer">
                <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
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
        password: "",
        scopes: []
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
            store.dispatch(settingsTokensCreate(
                values.password.trim(), name, values.scopes,
                () => formik.setFieldError("password", "password-incorrect")
            ));
        } else {
            store.dispatch(settingsTokensUpdate(formik.props.token.id, name));
        }
        formik.setSubmitting(false);
    }

};

const TokenDialogOuter = withFormik(tokenLogic)(TokenDialogInner);

export default function TokenDialog() {
    const token = useSelector((state: ClientState) => state.settings.tokens.dialog.token);

    return <TokenDialogOuter token={token}/>;
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { Scope, SCOPES, SCOPES_VIEW_ALL } from "api";
import { Checkbox, FormGroup } from "ui/control";
import { CheckboxField } from "ui/control/field";
import "./PermissionSelector.css";

const SCOPES_VIEW_ALL_SET = new Set(SCOPES_VIEW_ALL);

interface Props {
    title: string;
    name: string;
    enabledPermissions?: Scope[] | null;
}

export default function PermissionSelector({title, name, enabledPermissions}: Props) {
    const {t} = useTranslation();

    const [, {value}, {setValue}] = useField<Scope[]>(name);

    const scopeAllChecked = value.length === SCOPES.length ? true : (value.length === 0 ? false : null);

    const onScopeAllChange = () => setValue(scopeAllChecked ? [] : SCOPES);

    const scopesSet = new Set(value);

    // @ts-ignore
    const scopeViewAllChecked = scopesSet.isSupersetOf(SCOPES_VIEW_ALL_SET)
        ? true
        // @ts-ignore
        : (scopesSet.intersection(SCOPES_VIEW_ALL_SET).size === 0 ? false : null);

    const onScopeViewAllChange = () =>
        setValue(
            scopeViewAllChecked
                ? value.filter(sc => !SCOPES_VIEW_ALL_SET.has(sc))
                : value.concat(SCOPES_VIEW_ALL)
        );

    return (
        <>
            <div className="mb-2">{title}</div>
            <fieldset className="permission-checkboxes">
                <FormGroup title={t("scope.all")} layout="right" groupClassName="mb-0"
                           labelClassName="text-danger">
                    <Checkbox name={name} className="form-check-input" checked={scopeAllChecked}
                              onChange={onScopeAllChange} disabled={enabledPermissions != null}/>
                </FormGroup>
                <FormGroup title={t("scope.view-all")} layout="right">
                    <Checkbox name={name} className="form-check-input" checked={scopeViewAllChecked}
                              onChange={onScopeViewAllChange} disabled={enabledPermissions != null}/>
                </FormGroup>
                {SCOPES.map(sc =>
                    <CheckboxField<Scope[]> key={sc} id={`${name}_${sc}`} name={name} value={sc}
                                            title={t(`scope.${sc}`)} groupClassName="mb-0"
                                            isChecked={(v: string[]) => v.includes(sc)}
                                            disabled={enabledPermissions != null && !enabledPermissions.includes(sc)}
                                            anyValue/>
                )}
            </fieldset>
        </>
    );
}

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import debounce from 'lodash.debounce';
import i18n, { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import PROVIDERS from "providers";
import { NamingRules } from "api";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getSetting, getSettingMeta } from "state/settings/selectors";
import {
    cancelSignUpDialog,
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    SIGN_UP_STAGE_PROFILE,
    signUp,
    signUpDomainVerify,
    signUpFindDomain,
    signUpNameVerify
} from "state/signupdialog/actions";
import { findPreferredLanguage } from "i18n";
import { Browser } from "ui/browser";
import { Button, ModalDialog, NameHelp } from "ui/control";
import { CheckboxField, InputField, SelectField, SelectFieldChoice } from "ui/control/field";
import DomainField from "ui/signupdialog/DomainField";
import store from "state/store";
import { SignUpStage } from "state/signupdialog/state";

const PROVIDER_CHOICES = (Browser.isDevMode() ? PROVIDERS : PROVIDERS.filter(p => !p.dev))
    .map(p => ({title: p.title, value: p.name}));

interface OuterProps {
    stage: SignUpStage;
    name: string | null;
    domain: string | null;
    password: string | null;
    email: string | null;
    language: string;
}

interface Values {
    language: string;
    provider: string;
    name: string;
    nameTaken: string | null;
    domain: string;
    domainTaken: string | null;
    autoDomain: boolean;
    password: string;
    confirmPassword: string;
    email: string;
    termsAgree: boolean;
    googlePlayAllowed: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function SignUpDialogInner({stage, values, setFieldValue, setFieldTouched}: Props) {
    const processing = useSelector((state: ClientState) => state.signUpDialog.processing);
    const languages = useSelector((state: ClientState) => getSettingMeta(state, "language")?.modifiers?.items);
    const connectedToHome = useSelector(isConnectedToHome);
    const dispatch = useDispatch();

    const languageSelectRef = useRef<HTMLSelectElement>(null);
    const providerSelectRef = useRef<HTMLSelectElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const lastVerifiedName = useRef<string | null>(null);
    const lastVerifiedDomain = useRef<string | null>(null);

    const currentValues = useRef<Values>(values); // To be used in debounced callbacks
    currentValues.current = values;

    const {t} = useTranslation();

    const onLanguageClick = useCallback(() => {
        if (!connectedToHome) {
            let lang = languageSelectRef.current?.value;
            if (lang === "auto") {
                lang = findPreferredLanguage();
            }
            if (lang !== i18n.language) {
                i18n.changeLanguage(lang);
            }
        }
    }, [connectedToHome]);

    useEffect(() => {
        const dom = languageSelectRef.current;
        if (dom != null) {
            dom.addEventListener("click", onLanguageClick);
            onLanguageClick();

            return () => dom.removeEventListener("click", onLanguageClick);
        }
    }, [onLanguageClick]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const verifyName = useCallback(
        debounce(name => {
            const verifiedName = `${currentValues.current.provider};${currentValues.current.autoDomain};${name}`;
            if (lastVerifiedName.current === verifiedName) {
                return;
            }
            lastVerifiedName.current = verifiedName;
            if (!name || name.length > NamingRules.NAME_MAX_LENGTH || !NamingRules.isRegisteredNameValid(name)) {
                setFieldValue("domain", "");
                return;
            }
            dispatch(signUpNameVerify(name, (name, free) => {
                setFieldValue("nameTaken", free ? null : name);
                setFieldTouched("name", true, true);
            }));
            if (currentValues.current.autoDomain) {
                dispatch(signUpFindDomain(currentValues.current.provider, name, (provider, name, domainName) => {
                    if (name === currentValues.current.name && provider === currentValues.current.provider) {
                        const i = domainName.indexOf(".");
                        setFieldValue("domain", i > 0 ? domainName.substring(0, i) : domainName);
                    }
                }));
            }
        }, 500),
        [setFieldValue, setFieldTouched, dispatch]
    );

    const onProviderClick = useCallback(() => {
        verifyName(values.name);
        verifyName.flush();
    }, [values.name, verifyName]);

    useEffect(() => {
        const dom = providerSelectRef.current;
        if (dom != null) {
            dom.addEventListener("click", onProviderClick);

            return () => dom.removeEventListener("click", onProviderClick);
        }
    }, [onProviderClick]);

    const onNameInput = useCallback((event: Event) => {
        verifyName((event.target as HTMLInputElement).value);
    }, [verifyName]);

    const onNameBlur = useCallback((event: Event) => {
        verifyName((event.target as HTMLInputElement).value);
        verifyName.flush();
    }, [verifyName]);

    useEffect(() => {
        const dom = nameInputRef.current;
        if (dom != null) {
            dom.addEventListener("input", onNameInput);
            dom.addEventListener("blur", onNameBlur);

            return () => {
                dom.removeEventListener("input", onNameInput);
                dom.removeEventListener("blur", onNameBlur);
            }
        }
    }, [onNameBlur, onNameInput]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const verifyDomain = useCallback(
        debounce(domain => {
            const verifiedDomain = `${currentValues.current.provider};${domain}`;
            if (lastVerifiedDomain.current === verifiedDomain) {
                return;
            }
            lastVerifiedDomain.current = verifiedDomain;
            dispatch(signUpDomainVerify(currentValues.current.provider, domain, (domain, free) => {
                setFieldValue("domainTaken", free ? null : domain);
                setFieldTouched("domain", true, true);
            }));
        }, 500),
        [setFieldValue, setFieldTouched, dispatch]
    );

    const onDomainInput = (domain: string) => {
        verifyDomain(domain);
    };

    const onDomainBlur = (domain: string) => {
        verifyDomain(domain);
        verifyDomain.flush();
    };

    const onAutoDomainChange = () => {
        verifyName(values.name);
    }

    const languageChoices = useMemo(
        () => (languages ?? [{value: "auto"} as SelectFieldChoice])
                .map(l => ({
                    title: t(`setting.client.mercy.language-items.${l.value}`, {defaultValue: l.title}),
                    value: l.value
                })),
        [languages, t]
    );

    const onClose = () => dispatch(cancelSignUpDialog());

    return (
        <ModalDialog title={t("create-blog")} onClose={onClose}>
            <Form>
                <div className="modal-body sign-up-dialog">
                    <SelectField name="language" title={t("language")} choices={languageChoices} anyValue
                                 disabled={processing || stage > SIGN_UP_STAGE_PROFILE}
                                 selectRef={languageSelectRef} autoFocus/>
                    <SelectField name="provider" title={t("provider")} choices={PROVIDER_CHOICES} anyValue
                                 disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}
                                 selectRef={providerSelectRef}/>
                    <InputField name="name" title={t("name")} inputRef={nameInputRef}
                                disabled={processing || stage > SIGN_UP_STAGE_NAME}/>
                    <NameHelp/>
                    <DomainField name="domain" title={t("domain")}
                                 disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}
                                 onDomainInput={onDomainInput} onDomainBlur={onDomainBlur}
                                 onAutoChange={onAutoDomainChange}/>
                    <InputField name="password" title={t("new-password")}
                                disabled={processing || stage > SIGN_UP_STAGE_PASSWORD}/>
                    <InputField name="confirmPassword" title={t("confirm-password")}
                                disabled={processing || stage > SIGN_UP_STAGE_PASSWORD}/>
                    <InputField name="email" title={t("e-mail")}
                                disabled={processing || stage > SIGN_UP_STAGE_PROFILE}/>
                    {Browser.isAndroidGooglePlay() &&
                        <CheckboxField titleHtml={getTermsTitle(t)} name="termsAgree"/>
                    }
                    <CheckboxField title={t("want-allow-android-google-play")} name="googlePlayAllowed"/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={processing}>{t("create")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

function getTermsTitle(t: TFunction): string {
    return t("read-and-agree-with")
        + " <a href='https://moera.org/license/terms-and-conditions.html' target='_blank'>"
        + t("terms-and-conditions")
        + "</a>";
}

const signUpDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        language: props.language,
        provider: Browser.isDevMode() ? "local" : "moera.blog",
        name: props.name ?? "",
        nameTaken: null,
        domain: props.domain ?? "",
        domainTaken: null,
        autoDomain: !props.domain,
        password: props.password ?? "",
        confirmPassword: props.password ?? "",
        email: props.email ?? "",
        termsAgree: !Browser.isAndroidApp(),
        googlePlayAllowed: true
    }),

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("must-not-empty").max(NamingRules.NAME_MAX_LENGTH)
            .test("is-allowed", "not-allowed", NamingRules.isRegisteredNameValid)
            .when("nameTaken", ([nameTaken]: string[], schema: yup.StringSchema) =>
                schema.notOneOf([nameTaken], "name-already-taken")),
        domain: yup.string()
            .when("autoDomain", {
                is: true,
                then: () => yup.string().notRequired(),
                otherwise: () => yup.string().trim()
                    .required("must-not-empty")
                    .min(4, "domain-too-short")
                    .lowercase().matches(/^[a-z-][a-z0-9-]+$/, "not-allowed")
                    .when("domainTaken",
                        ([domainTaken]: string[], schema: yup.StringSchema) =>
                            schema.notOneOf([domainTaken], "domain-already-taken")),
            }),
        password: yup.string().required("must-not-empty"),
        confirmPassword: yup.string().when("password",
            ([password]: string[], schema: yup.StringSchema) =>
                schema.required("retype-password").oneOf([password], "passwords-different")
        ),
        email: yup.string().email("not-valid-e-mail"),
        termsAgree: yup.boolean().test("agree", "need-agree-with-terms", v => v ?? false),
        googlePlayAllowed: yup.boolean().test("agree", "need-allow-google-play",
                v => !Browser.isAndroidGooglePlay() || (v ?? false))
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        store.dispatch(signUp(values.language, values.provider, values.name.trim(),
            values.autoDomain && formik.props.stage <= SIGN_UP_STAGE_DOMAIN ? null : values.domain.trim(),
            values.password, values.email, values.googlePlayAllowed,
            (fieldName, message) => formik.setFieldError(fieldName, message)));
        formik.setSubmitting(false);
    }

};

const SignUpDialogOuter = withFormik(signUpDialogLogic)(SignUpDialogInner);

export default function SignUpDialog() {
    const stage = useSelector((state: ClientState) => state.signUpDialog.stage);
    const name = useSelector((state: ClientState) => state.signUpDialog.name);
    const domain = useSelector((state: ClientState) => state.signUpDialog.domain);
    const password = useSelector((state: ClientState) => state.signUpDialog.password);
    const email = useSelector((state: ClientState) => state.signUpDialog.email);
    const language = useSelector((state: ClientState) => getSetting(state, "language") as string);

    return <SignUpDialogOuter stage={stage} name={name} domain={domain} password={password} email={email}
                              language={language}/>;
}

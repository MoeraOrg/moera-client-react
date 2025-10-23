import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';

import i18n, { findPreferredLanguage, tTitle } from "i18n";
import PROVIDERS from "providers";
import { NamingRules } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { isConnectedToHome } from "state/home/selectors";
import {
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    SIGN_UP_STAGE_PROFILE,
    signUp,
    signUpDomainVerify,
    signUpFindDomain,
    signUpNameVerify
} from "state/signup/actions";
import { SignUpStage } from "state/signup/state";
import { getSetting, getSettingMeta } from "state/settings/selectors";
import { Button } from "ui/control";
import { CheckboxField, InputField, SelectField, SelectFieldChoice } from "ui/control/field";
import { useDebounce } from "ui/hook";
import * as Browser from "ui/browser";
import Jump from "ui/navigation/Jump";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import DomainField from "ui/signup/DomainField";
import { getSheriffPolicyHref } from "util/sheriff";
import { urlWithParameters } from "util/url";
import { isEmail } from "util/misc";
import "./SignUpPage.css";

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

function SignUpPageInner({stage, values, setFieldValue, touched, setFieldTouched}: Props) {
    const backHref = useSelector((state: ClientState) => state.signUp.backHref);
    const processing = useSelector((state: ClientState) => state.signUp.processing);
    const languages = useSelector((state: ClientState) => getSettingMeta(state, "language")?.modifiers?.items);
    const connectedToHome = useSelector(isConnectedToHome);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const languageSelectRef = useRef<HTMLSelectElement>(null);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const [nameToVerify] = useDebounce(values.name, 500);
    const lastVerifiedName = useRef<string | null>(null);

    const [domain, setDomain] = useState<string | null>(null);
    const [domainToVerify, setDomainToVerify] = useDebounce(domain, 500);
    const lastVerifiedDomain = useRef<string | null>(null);

    const onLanguageClick = useCallback(() => {
        if (!connectedToHome) {
            let lang = languageSelectRef.current?.value;
            if (lang === "auto") {
                lang = findPreferredLanguage();
            }
            if (lang !== i18n.language) {
                Browser.changeLanguage(lang);
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

    useEffect(() => {
        if (!touched.name && values.name) {
            setFieldTouched("name", true);
        }
    }, [setFieldTouched, touched.name, values.name]);

    useEffect(
        () => {
            const verifiedName = `${values.provider};${values.autoDomain};${nameToVerify}`;
            if (lastVerifiedName.current === verifiedName) {
                return;
            }
            lastVerifiedName.current = verifiedName;

            if (!nameToVerify
                || nameToVerify.length > NamingRules.NAME_MAX_LENGTH
                || !NamingRules.isRegisteredNameValid(nameToVerify)
            ) {
                setFieldValue("domain", "");
                return;
            }

            dispatch(signUpNameVerify(nameToVerify, (name, free) => {
                setFieldValue("nameTaken", free ? null : name);
            }));

            if (values.autoDomain) {
                dispatch(signUpFindDomain(values.provider, nameToVerify, (provider, name, domainName) => {
                    const verifiedName = `${provider};${values.autoDomain};${name}`;
                    if (verifiedName === lastVerifiedName.current) {
                        const i = domainName.indexOf(".");
                        setFieldValue("domain", i > 0 ? domainName.substring(0, i) : domainName);
                    }
                }));
            }
        },
        [setFieldValue, dispatch, values.provider, values.autoDomain, nameToVerify]
    );

    useEffect(
        () => {
            const verifiedDomain = `${values.provider};${domainToVerify}`;
            if (lastVerifiedDomain.current === verifiedDomain) {
                return;
            }
            lastVerifiedDomain.current = verifiedDomain;

            if (!domainToVerify) {
                setFieldValue("domainTaken", null);
                return;
            }

            dispatch(signUpDomainVerify(values.provider, domainToVerify, (domain, free) => {
                setFieldValue("domainTaken", free ? null : domain);
            }));
        },
        [setFieldValue, dispatch, values.provider, domainToVerify]
    );

    const onDomainInput = (domain: string) => {
        setDomain(domain);
        if (!touched.domain && domain) {
            setFieldTouched("domain", true);
        }
    };

    const onDomainBlur = (domain: string) => {
        setDomain(domain);
        setDomainToVerify(domain);
    };

    const languageChoices = useMemo(
        () => (languages ?? [{value: "auto"} as SelectFieldChoice])
            .map(l => ({
                title: t(`setting.client.mercy.language-items.${l.value}`, {defaultValue: l.title}),
                value: l.value
            })),
        [languages, t]
    );

    const disabled = Object.keys(signUpPageLogic.validate(values)).length > 0 || processing;

    return (
        <>
            <GlobalTitle back={backHref}/>
            <main className="signup-page global-page">
                <div className="title">{tTitle(t("create-account"))}</div>
                <Form>
                    <InputField name="name" title={t("blog-name")} tooltip="name-help" ref={nameInputRef}
                                disabled={processing || stage > SIGN_UP_STAGE_NAME} errorsOnly autoFocus/>
                    <DomainField name="domain" title={t("domain")}
                                 disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}
                                 onDomainInput={onDomainInput} onDomainBlur={onDomainBlur}/>
                    <InputField name="password" title={t("password")}
                                disabled={processing || stage > SIGN_UP_STAGE_PASSWORD} errorsOnly/>
                    <InputField name="confirmPassword" title={t("confirm-password")}
                                disabled={processing || stage > SIGN_UP_STAGE_PASSWORD} errorsOnly/>
                    <InputField name="email" title={t("e-mail")}
                                disabled={processing || stage > SIGN_UP_STAGE_PROFILE} errorsOnly/>
                    <SelectField name="provider" title={t("provider")} choices={PROVIDER_CHOICES} anyValue
                                 disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}/>
                    <SelectField name="language" title={t("language")} choices={languageChoices} anyValue
                                 disabled={processing || stage > SIGN_UP_STAGE_PROFILE} ref={languageSelectRef}/>
                    <CheckboxField
                        title={
                            <Trans i18nKey="read-and-agree-to-terms">
                                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                                <a href="https://moera.org/license/terms-and-conditions.html" target="_blank"
                                   rel="noreferrer"/>
                                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                                <a href={getSheriffPolicyHref(values.language)} target="_blank" rel="noreferrer"/>
                            </Trans>
                        }
                        name="termsAgree"
                        groupClassName="mb-0"
                        errorsOnly
                    />
                    <CheckboxField
                        title={
                            <Trans i18nKey="agree-to-sheriff-oversight">
                                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                                <a href={getSheriffPolicyHref(values.language)} target="_blank" rel="noreferrer"/>
                            </Trans>
                        }
                        name="googlePlayAllowed"
                        anyValue
                    />
                    <Button type="submit" variant="primary" className="submit-button" disabled={disabled}
                            loading={processing}>
                        {tTitle(t("create-account-submit"))}
                    </Button>
                </Form>
                <div className="link mt-3">
                    {t("already-have-account")}{" "}
                    <Jump className="btn btn-link" href={urlWithParameters("/connect", {back: backHref})}>
                        {t("connect")}
                    </Jump>
                </div>
            </main>
        </>
    );
}

const signUpPageLogic = {

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

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        const name = values.name.trim();
        if (!name) {
            errors.name = "must-not-empty";
        } else if (name.length > NamingRules.NAME_MAX_LENGTH || !NamingRules.isRegisteredNameValid(name)) {
            errors.name = "not-allowed";
        } else if (values.nameTaken?.includes(name)) {
            errors.name = "name-already-taken";
        }

        if (!values.autoDomain) {
            const domain = values.domain.trim();
            if (!domain) {
                errors.domain = "must-not-empty";
            } else if (domain.length < 4) {
                errors.domain = "domain-too-short";
            } else if (!domain.toLowerCase().match(/^[a-z-][a-z0-9-]+$/)) {
                errors.domain = "not-allowed";
            } else if (values.domainTaken?.includes(name)) {
                errors.domain = "domain-already-taken";
            }
        }

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

        if (values.email && !isEmail(values.email)) {
            errors.email = "not-valid-e-mail";
        }

        if (!values.termsAgree) {
            errors.termsAgree = "need-agree-with-terms";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(
            signUp(
                values.language,
                values.provider,
                values.name.trim(),
                values.autoDomain && formik.props.stage <= SIGN_UP_STAGE_DOMAIN ? null : values.domain.trim(),
                values.password,
                values.email,
                values.googlePlayAllowed,
                (fieldName, message) => formik.setFieldError(fieldName, message)
            )
        );
        formik.setSubmitting(false);
    }

};

const SignUpPageOuter = withFormik(signUpPageLogic)(SignUpPageInner);

export default function SignUpPage() {
    const stage = useSelector((state: ClientState) => state.signUp.stage);
    const name = useSelector((state: ClientState) => state.signUp.name);
    const domain = useSelector((state: ClientState) => state.signUp.domain);
    const password = useSelector((state: ClientState) => state.signUp.password);
    const email = useSelector((state: ClientState) => state.signUp.email);
    const language = useSelector((state: ClientState) => getSetting(state, "language") as string);

    return <SignUpPageOuter stage={stage} name={name} domain={domain} password={password} email={email}
                            language={language}/>;
}

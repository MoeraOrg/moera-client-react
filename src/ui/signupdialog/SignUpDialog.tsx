import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { StringSchema } from 'yup';
import debounce from 'lodash.debounce';
import i18n from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';

import PROVIDERS from "providers";
import * as Rules from "api/naming/rules";
import { Choice } from "api/node/api-types";
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
import { InputField, SelectField } from "ui/control/field";
import DomainField from "ui/signupdialog/DomainField";

type OuterProps = ConnectedProps<typeof connector> & WithTranslation;

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
}

type Props = OuterProps  & FormikProps<Values>;

class SignUpDialog extends React.PureComponent<Props> {

    #languageSelectDom: HTMLSelectElement | null = null;
    #providerSelectDom: HTMLSelectElement | null = null;
    #nameInputDom: HTMLInputElement | null = null;
    #lastVerifiedName: string | null = null;
    #lastVerifiedDomain: string | null = null;

    setLanguageSelectRef = (dom: HTMLSelectElement | null) => {
        this.#languageSelectDom = dom;
        if (this.#languageSelectDom) {
            this.#languageSelectDom.addEventListener("click", this.onLanguageClick);
            this.onLanguageClick();
        }
    }

    setProviderSelectRef = (dom: HTMLSelectElement | null) => {
        this.#providerSelectDom = dom;
        if (this.#providerSelectDom) {
            this.#providerSelectDom.addEventListener("click", this.onProviderClick);
        }
    }

    setNameInputRef = (dom: HTMLInputElement | null) => {
        this.#nameInputDom = dom;
        if (this.#nameInputDom) {
            this.#nameInputDom.addEventListener("input", this.onNameInput);
            this.#nameInputDom.addEventListener("blur", this.onNameBlur);
        }
    }

    componentWillUnmount() {
        if (this.#languageSelectDom) {
            this.#languageSelectDom.removeEventListener("click", this.onLanguageClick);
        }
        if (this.#providerSelectDom) {
            this.#providerSelectDom.removeEventListener("click", this.onProviderClick);
        }
        if (this.#nameInputDom) {
            this.#nameInputDom.removeEventListener("input", this.onNameInput);
            this.#nameInputDom.removeEventListener("blur", this.onNameBlur);
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: signUpDialogLogic.mapPropsToValues(this.props),
            });
        }
    }

    onLanguageClick = () => {
        if (!this.props.connectedToHome) {
            let lang = this.#languageSelectDom?.value;
            if (lang === "auto") {
                lang = findPreferredLanguage();
            }
            if (lang !== i18n.language) {
                i18n.changeLanguage(lang);
            }
        }
    }

    onProviderClick = () => {
        this.verifyName(this.props.values.name);
        this.verifyName.flush();
    }

    onNameInput = (event: Event) => {
        this.verifyName((event.target as HTMLInputElement).value);
    };

    onNameBlur = (event: Event) => {
        this.verifyName((event.target as HTMLInputElement).value);
        this.verifyName.flush();
    };

    onDomainInput = (domain: string) => {
        this.verifyDomain(domain);
    };

    onDomainBlur = (domain: string) => {
        this.verifyDomain(domain);
        this.verifyDomain.flush();
    };

    onAutoDomainChange = () => {
        this.verifyName(this.props.values.name);
    }

    verifyName = debounce(name => {
        const {values, setFieldValue, setFieldTouched, signUpNameVerify, signUpFindDomain} = this.props;

        const verifiedName = `${values.provider};${values.autoDomain};${name}`;
        if (this.#lastVerifiedName === verifiedName) {
            return;
        }
        this.#lastVerifiedName = verifiedName;
        if (!name || name.length > Rules.NAME_MAX_LENGTH || !Rules.isRegisteredNameValid(name)) {
            setFieldValue("domain", "");
            return;
        }
        signUpNameVerify(name, (name, free) => {
            setFieldValue("nameTaken", free ? null : name);
            setFieldTouched("name", true, true);
        });
        if (values.autoDomain) {
            signUpFindDomain(values.provider, name, (provider, name, domainName) => {
                if (name === values.name && provider === values.provider) {
                    const i = domainName.indexOf(".");
                    setFieldValue("domain", i > 0 ? domainName.substring(0, i) : domainName);
                }
            });
        }
    }, 500);

    verifyDomain = debounce(domain => {
        const {values, setFieldValue, setFieldTouched, signUpDomainVerify} = this.props;

        const verifiedDomain = `${values.provider};${domain}`;
        if (this.#lastVerifiedDomain === verifiedDomain) {
            return;
        }
        this.#lastVerifiedDomain = verifiedDomain;
        signUpDomainVerify(values.provider, domain, (domain, free) => {
            setFieldValue("domainTaken", free ? null : domain);
            setFieldTouched("domain", true, true);
        });
    }, 500);

    getProviders() {
        const providers = Browser.isDevMode() ? PROVIDERS : PROVIDERS.filter(p => !p.dev);
        return providers.map(p => ({title: p.title, value: p.name}));
    }

    render() {
        const {show, processing, stage, languages, cancelSignUpDialog, t} = this.props;

        if (!show) {
            return null;
        }

        const languageChoices = (languages ?? [{value: "auto"} as Choice<string>])
            .map(l => ({
                title: t(`setting.client.mercy.language-items.${l.value}`, {defaultValue: l.title}),
                value: l.value
            }));
        return (
            <ModalDialog title={t("create-blog")} onClose={cancelSignUpDialog}>
                <Form>
                    <div className="modal-body sign-up-dialog">
                        <SelectField name="language" title={t("language")} choices={languageChoices} anyValue
                                     disabled={processing || stage > SIGN_UP_STAGE_PROFILE}
                                     selectRef={this.setLanguageSelectRef}/>
                        <SelectField name="provider" title={t("provider")} choices={this.getProviders()} anyValue
                                     disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}
                                     selectRef={this.setProviderSelectRef}/>
                        <InputField name="name" title={t("name")} autoFocus inputRef={this.setNameInputRef}
                                    disabled={processing || stage > SIGN_UP_STAGE_NAME}/>
                        <NameHelp/>
                        <DomainField name="domain" title={t("domain")}
                                     disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}
                                     onDomainInput={this.onDomainInput} onDomainBlur={this.onDomainBlur}
                                     onAutoChange={this.onAutoDomainChange}/>
                        <InputField name="password" title={t("new-password")}
                                    disabled={processing || stage > SIGN_UP_STAGE_PASSWORD}/>
                        <InputField name="confirmPassword" title={t("confirm-password")}
                                    disabled={processing || stage > SIGN_UP_STAGE_PASSWORD}/>
                        <InputField name="email" title={t("e-mail")}
                                    disabled={processing || stage > SIGN_UP_STAGE_PROFILE}/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={cancelSignUpDialog}>{t("cancel")}</Button>
                        <Button variant="primary" type="submit" loading={processing}>{t("create")}</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

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
        email: props.email ?? ""
    }),

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("must-not-empty").max(Rules.NAME_MAX_LENGTH)
            .test("is-allowed", "not-allowed", Rules.isRegisteredNameValid)
            .when("nameTaken",
                (nameTaken: string, schema: StringSchema) => schema.notOneOf([nameTaken], "name-already-taken")),
        domain: yup.string()
            .when("autoDomain", {
                is: true,
                then: yup.string().notRequired(),
                otherwise: yup.string().trim()
                    .required("must-not-empty")
                    .min(4, "domain-too-short")
                    .lowercase().matches(/^[a-z-][a-z0-9-]+$/, "not-allowed")
                    .when("domainTaken",
                        (domainTaken: string, schema: StringSchema) =>
                            schema.notOneOf([domainTaken], "domain-already-taken")),
            }),
        password: yup.string().required("must-not-empty"),
        confirmPassword: yup.string().when("password",
            (password: string, schema: StringSchema) =>
                schema.required("retype-password").oneOf([password], "passwords-different")
        ),
        email: yup.string().email("not-valid-e-mail")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.signUp(values.language, values.provider, values.name.trim(),
            values.autoDomain && formik.props.stage <= SIGN_UP_STAGE_DOMAIN ? null : values.domain.trim(),
            values.password, values.email, (fieldName, message) => formik.setFieldError(fieldName, message));
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        ...state.signUpDialog,
        language: getSetting(state, "language") as string,
        languages: getSettingMeta(state, "language")?.modifiers?.items,
        connectedToHome: isConnectedToHome(state)
    }),
    { cancelSignUpDialog, signUp, signUpNameVerify, signUpFindDomain, signUpDomainVerify }
);

export default connector(withTranslation()(withFormik(signUpDialogLogic)(SignUpDialog)));

import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';
import debounce from 'lodash.debounce';

import * as Rules from "api/naming/rules";
import {
    cancelSignUpDialog,
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    signUp,
    signUpFindDomain,
    signUpNameVerify
} from "state/signupdialog/actions";
import { Button, ModalDialog, NameHelp } from "ui/control";
import { InputField, SelectField } from "ui/control/field";
import DomainField from "ui/signupdialog/DomainField";
import { Browser } from "api";
import PROVIDERS from "providers";

class SignUpDialog extends React.PureComponent {

    #providerSelectDom;
    #nameInputDom;
    #lastVerifiedName = null;

    setProviderSelectRef = dom => {
        this.#providerSelectDom = dom;
        if (this.#providerSelectDom) {
            this.#providerSelectDom.addEventListener("click", this.onProviderChange);
        }
    }

    setNameInputRef = dom => {
        this.#nameInputDom = dom;
        if (this.#nameInputDom) {
            this.#nameInputDom.addEventListener("input", this.onNameInput);
            this.#nameInputDom.addEventListener("blur", this.onNameBlur);
        }
    }

    componentWillUnmount() {
        if (this.#providerSelectDom) {
            this.#providerSelectDom.removeEventListener("click", this.onProviderChange);
        }
        if (this.#nameInputDom) {
            this.#nameInputDom.removeEventListener("input", this.onNameInput);
            this.#nameInputDom.removeEventListener("blur", this.onNameBlur);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: signUpDialogLogic.mapPropsToValues(this.props),
            });
        }
    }

    onProviderChange = () => {
        this.verifyName(this.props.values.name);
        this.verifyName.flush();
    }

    onNameInput = event => {
        this.verifyName(event.target.value);
    };

    onNameBlur = event => {
        this.verifyName(event.target.value);
        this.verifyName.flush();
    };

    verifyName = debounce(name => {
        const {values, setFieldValue, setFieldError, signUpNameVerify, signUpFindDomain} = this.props;

        if (this.#lastVerifiedName === `${values.provider};${name}`) {
            return;
        }
        this.#lastVerifiedName = `${values.provider};${name}`;
        if (!name || name.length > Rules.NAME_MAX_LENGTH || !Rules.isNameValid(name)) {
            setFieldValue("domain", "");
            return;
        }
        signUpNameVerify(name, (provider, name, free) => {
            if (name === values.name && !free) {
                setFieldError("name", "Name is already taken");
            }
        });
        signUpFindDomain(values.provider, name, (provider, name, domainName) => {
            if (name === values.name && provider === values.provider) {
                const i = domainName.indexOf(".");
                setFieldValue("domain", i > 0 ? domainName.substring(0, i) : domainName);
            }
        });
    }, 500);

    getProviders() {
        const providers = Browser.isDevMode() ? PROVIDERS : PROVIDERS.filter(p => !p.dev);
        return providers.map(p => ({title: p.title, value: p.name}));
    }

    render() {
        const {show, processing, stage, cancelSignUpDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Create a Blog" onClose={cancelSignUpDialog}>
                <Form>
                    <div className="modal-body sign-up-dialog">
                        <SelectField name="provider" title="Provider" choices={this.getProviders()} anyValue
                                     disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}
                                     selectRef={this.setProviderSelectRef}/>
                        <InputField name="name" title="Name" autoFocus inputRef={this.setNameInputRef}
                                    disabled={processing || stage > SIGN_UP_STAGE_NAME}/>
                        <NameHelp/>
                        <DomainField name="domain" title="Domain"
                                     disabled={processing || stage > SIGN_UP_STAGE_DOMAIN}/>
                        <InputField name="password" title="New password"
                                    disabled={processing || stage > SIGN_UP_STAGE_PASSWORD}/>
                        <InputField name="confirmPassword" title="Confirm password"
                                    disabled={processing || stage > SIGN_UP_STAGE_PASSWORD}/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={cancelSignUpDialog}>Cancel</Button>
                        <Button variant="primary" type="submit" loading={processing}>Create</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const signUpDialogLogic = {

    mapPropsToValues(props) {
        return {
            provider: props.provider ?? (Browser.isDevMode() ? "local" : "moera.blog"),
            name: props.name ?? "",
            domain: props.domain ?? "",
            autoDomain: !props.domain,
            password: props.password ?? "",
            confirmPassword: props.password ?? ""
        }
    },

    validationSchema: yup.object().shape({
        name: yup.string().trim().required("Must not be empty").max(Rules.NAME_MAX_LENGTH)
            .test("is-allowed", "Not allowed", Rules.isNameValid),
        domain: yup.string()
            .when("autoDomain", {
                is: true,
                then: yup.string().notRequired(),
                otherwise: yup.string().trim()
                    .required("Must not be empty")
                    .min(4, "Too short, should be 4 characters at least")
                    .lowercase().matches(/^[a-z-][a-z0-9-]+$/, "Not allowed")
            }),
        password: yup.string().required("Must not be empty"),
        confirmPassword: yup.string().when("password",
            (password, schema) =>
                schema.required("Please type the password again").oneOf([password], "Passwords are different")
        )
    }),

    handleSubmit(values, formik) {
        formik.props.signUp(values.provider, values.name.trim(), values.autoDomain ? null : values.domain.trim(),
            values.password, (fieldName, message) => formik.setFieldError(fieldName, message));
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        ...state.signUpDialog
    }),
    { cancelSignUpDialog, signUp, signUpNameVerify, signUpFindDomain }
)(withFormik(signUpDialogLogic)(SignUpDialog));

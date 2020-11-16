import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import cx from 'classnames';
import selectn from 'selectn';

import { FormFieldGroup } from "ui/control/field";
import { Button } from "ui/control";
import "./DomainField.css";
import PROVIDERS from "providers";

export default class DomainField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        wrapper: PropType.string,
        disabled: PropType.bool,
        onDomainInput: PropType.func,
        onDomainBlur: PropType.func,
        onAutoChange: PropType.func
    };

    #inputDom;

    setInputRef = dom => {
        this.#inputDom = dom;
        if (this.#inputDom) {
            this.#inputDom.addEventListener("input", this.onInputInput);
            this.#inputDom.addEventListener("blur", this.onInputBlur);
        }
    }

    componentWillUnmount() {
        if (this.#inputDom) {
            this.#inputDom.removeEventListener("input", this.onInputInput);
            this.#inputDom.removeEventListener("blur", this.onInputBlur);
        }
    }

    onInputInput = event => {
        const {onDomainInput} = this.props;

        if (onDomainInput) {
            onDomainInput(event.target.value);
        }
    }

    onInputBlur = event => {
        const {onDomainBlur} = this.props;

        if (onDomainBlur) {
            onDomainBlur(event.target.value);
        }
    }

    onAutoClick = form => () => {
        const {onAutoChange} = this.props;

        const auto = !form.values.autoDomain;
        form.setFieldValue("autoDomain", auto);
        if (onAutoChange) {
            onAutoChange(auto);
        }
    }

    getProviderSuffix(provider) {
        return PROVIDERS.find(p => p.name === provider)?.domain;
    }

    render() {
        const {name, title, disabled} = this.props;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const touched = selectn(field.name, form.touched);
                    const error = selectn(field.name, form.errors);
                    const suffix = `.${this.getProviderSuffix(form.values.provider)}`;
                    return (
                        <FormFieldGroup title={title} name={name} field={field} form={form}>
                            <>
                                <div className={cx("domain-field", {"is-invalid": touched && error})}>
                                    {form.values.autoDomain ?
                                        (field.value ?
                                            <div className="domain-name">
                                                <span className="hostname">{field.value}</span>{suffix}
                                            </div>
                                        :
                                            <div className="domain-auto">Selected automatically</div>
                                        )
                                    :
                                        <>
                                            <input
                                                {...field}
                                                id={name}
                                                type="text"
                                                className={cx(
                                                    "form-control", {
                                                        "is-valid": touched && !error,
                                                        "is-invalid": touched && error,
                                                    })}
                                                disabled={disabled}
                                                ref={this.setInputRef}
                                            />
                                            <div className="suffix">{suffix}</div>
                                        </>
                                    }
                                    <Button variant="outline-secondary" size="sm" onClick={this.onAutoClick(form)}>
                                        {form.values.autoDomain ? "Change" : "Auto"}
                                    </Button>
                                </div>
                                {touched && error && <div className="invalid-feedback">{error}</div>}
                            </>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

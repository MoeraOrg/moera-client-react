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
        onAutoChange: PropType.func
    };

    onClick = form => () => {
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
                                            />
                                            <div className="suffix">{suffix}</div>
                                        </>
                                    }
                                    <Button variant="outline-secondary" size="sm" onClick={this.onClick(form)}>
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

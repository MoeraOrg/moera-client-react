import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import cx from 'classnames';
import selectn from 'selectn';

import { FormFieldGroup } from "ui/control/field";
import { Button } from "ui/control";
import "./DomainField.css";

export default class DomainField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        wrapper: PropType.string,
        disabled: PropType.bool
    };

    onClick = form => () => {
        form.setFieldValue("autoDomain", !form.values.autoDomain);
    }

    render() {
        const {name, title, disabled} = this.props;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const touched = selectn(field.name, form.touched);
                    const error = selectn(field.name, form.errors);
                    return (
                        <FormFieldGroup title={title} name={name} field={field} form={form}>
                            <div className={cx("domain-field", {"is-invalid": touched && error})}>
                                {form.values.autoDomain ?
                                    (field.value ?
                                        <div className="domain-name">
                                            <span className="hostname">{field.value}</span>.moera.blog
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
                                        <div className="suffix">.moera.blog</div>
                                    </>
                                }
                                <Button variant="outline-secondary" size="sm" onClick={this.onClick(form)}>
                                    {form.values.autoDomain ? "Edit" : "Auto"}
                                </Button>
                            </div>
                            {touched && error && <div className="invalid-feedback">{error}</div>}
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

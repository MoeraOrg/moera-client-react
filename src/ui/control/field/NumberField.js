import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import { NumberPicker } from 'react-widgets';

import { FormFieldGroup } from "ui/control/field";
import "./NumberField.css";

export const NumberField = ({name, title, autoFocus, disabled, format, min, max, step, initialValue, defaultValue}) => (
    <Field name={name}>
        {({field, form}) => {
            const touched = form.touched[field.name];
            const error = form.errors[field.name];
            return (
                <FormFieldGroup
                    title={title}
                    name={name}
                    field={field}
                    form={form}
                    initialValue={initialValue}
                    defaultValue={defaultValue}
                >
                    <>
                        {/* <label> is not functional, because NumberPicker doesn't allow to set id */}
                        <div className="number-control">
                            <NumberPicker
                                name={field.name}
                                value={field.value}
                                onChange={v => form.setFieldValue(field.name, v)}
                                autoFocus={autoFocus}
                                disabled={disabled}
                                format={format}
                                min={min}
                                max={max}
                                step={step ?? 1}
                            />
                        </div>
                        {touched && error && <div className="invalid-feedback">{error}</div>}
                    </>
                </FormFieldGroup>
            );
        }}
    </Field>
);

NumberField.propTypes = {
    name: PropType.string,
    title: PropType.string,
    autoFocus: PropType.bool,
    disabled: PropType.bool,
    format: PropType.string,
    min: PropType.number,
    max: PropType.number,
    step: PropType.number,
    initialValue: PropType.number,
    defaultValue: PropType.number
};

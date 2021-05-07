import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import { DateTimePicker } from 'react-widgets';

import { FormGroup, Wrapper } from "ui/control";

export const DateTimeField = ({name, title, horizontal = false, groupClassName, labelClassName, col, autoFocus}) => (
    <FormGroup name={name} title={title} horizontal={horizontal} groupClassName={groupClassName}
               labelClassName={labelClassName}>
        {/* <label> is not functional, because DateTimePicker doesn't allow to set id */}
        <Field name={name}>
            {({field, form}) => {
                const touched = form.touched[field.name];
                const error = form.errors[field.name];
                return (
                    <Wrapper className={col}>
                        <DateTimePicker
                            name={field.name}
                            value={field.value}
                            onChange={v => form.setFieldValue(field.name, v)}
                            onBlur={field.onBlur}
                            autoFocus={autoFocus}
                            valueFormat={{dateStyle: "short", timeStyle: "short"}}
                            includeTime={true}
                        />
                        {touched && error && <div className="invalid-feedback">{error}</div>}
                    </Wrapper>
                );
            }}
        </Field>
    </FormGroup>
);

DateTimeField.propTypes = {
    name: PropType.string,
    title: PropType.string,
    horizontal: PropType.bool,
    groupClassName: PropType.string,
    labelClassName: PropType.string,
    col: PropType.string,
    autoFocus: PropType.bool
};

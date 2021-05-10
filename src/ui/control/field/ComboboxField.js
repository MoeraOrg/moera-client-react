import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import { Combobox } from 'react-widgets';

import { FormGroup, Wrapper } from "ui/control";

export const ComboboxField = ({name, title, horizontal = false, groupClassName, labelClassName, col, autoFocus,
                               data}) => (
    <FormGroup title={title} name={name} horizontal={horizontal} labelClassName={labelClassName}
               groupClassName={groupClassName}>
        {/* <label> is not functional, because Combobox doesn't allow to set id */}
        <Field name={name}>
            {({field, form}) => {
                const touched = form.touched[field.name];
                const error = form.errors[field.name];
                return (
                    <Wrapper className={col}>
                        <Combobox
                            name={field.name}
                            value={field.value}
                            onChange={v => form.setFieldValue(field.name, v)}
                            suggest="true"
                            autoFocus={autoFocus}
                            data={data}
                        />
                        {touched && error && <div className="invalid-feedback">{error}</div>}
                    </Wrapper>
                );
            }}
        </Field>
    </FormGroup>
);

ComboboxField.propTypes = {
    name: PropType.string,
    title: PropType.string,
    horizontal: PropType.bool,
    groupClassName: PropType.string,
    labelClassName: PropType.string,
    col: PropType.string,
    autoFocus: PropType.bool,
    data: PropType.array
};

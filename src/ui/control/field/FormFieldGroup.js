import React from 'react';
import PropType from 'prop-types';

import { FormGroup } from "ui/control";

export const FormFieldGroup = ({field, form, initialValue, defaultValue, children, ...other}) => (
    <FormGroup
        {...other}
        undo={field != null && initialValue != null && field.value !== initialValue}
        reset={field != null && defaultValue != null && field.value !== defaultValue}
        onUndo={
            form != null && field != null && initialValue != null ?
                () => form.setFieldValue(field.name, initialValue)
            :
                null
        }
        onReset={
            form != null && field != null && defaultValue != null ?
                () => form.setFieldValue(field.name, defaultValue)
            :
                null
        }
    >
        {children}
    </FormGroup>
);

FormFieldGroup.propTypes = {
    title: PropType.string,
    name: PropType.string,
    horizontal: PropType.bool,
    groupClassName: PropType.string,
    labelClassName: PropType.string,
    children: PropType.element,
    field: PropType.object,
    form: PropType.object,
    initialValue: PropType.any,
    defaultValue: PropType.any
};

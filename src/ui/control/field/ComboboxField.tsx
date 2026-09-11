import React from 'react';
import { useField } from 'formik';
import Combobox from 'react-widgets/Combobox';
import { TextAccessor } from 'react-widgets/cjs/Accessors';

import { FormGroup, Wrapper } from "ui/control";
import FieldError from "ui/control/field/FieldError";

interface Props<T> {
    name: string;
    title?: string;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    autoFocus?: boolean;
    showError?: boolean;
    data?: T[];
    textField?: TextAccessor;
}

export function ComboboxField<T>({
    name, title, horizontal = false, groupClassName, labelClassName, col, autoFocus, showError = false, data, textField
}: Props<T>) {
    const [{onBlur}, {value, touched, error}, {setValue}] = useField<T | string>(name);

    return (
        <FormGroup title={title} name={name} horizontal={horizontal} labelClassName={labelClassName}
                   groupClassName={groupClassName}>
            {/* <label> is not functional because Combobox doesn't allow setting id */}
            <Wrapper className={col}>
                <Combobox
                    name={name}
                    value={value}
                    onChange={v => setValue(v)}
                    onBlur={onBlur}
                    autoFocus={autoFocus}
                    data={data}
                    textField={textField}
                />
                {showError && touched && <FieldError error={error}/>}
            </Wrapper>
        </FormGroup>
    );
}

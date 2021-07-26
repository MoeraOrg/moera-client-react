import React from 'react';
import { useField } from 'formik';
import { Combobox } from 'react-widgets';

import { FormGroup, Wrapper } from "ui/control/index";

interface Props<T> {
    name: string;
    title?: string;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    autoFocus?: boolean;
    data?: T[];
}

export function ComboboxField<T>({name, title, horizontal = false, groupClassName, labelClassName, col, autoFocus,
                                  data}: Props<T>) {
    const [{onBlur}, {value, touched, error}, {setValue}] = useField<T | string>(name);

    return (
        <FormGroup title={title} name={name} horizontal={horizontal} labelClassName={labelClassName}
                   groupClassName={groupClassName}>
            {/* <label> is not functional, because Combobox doesn't allow to set id */}
            <Wrapper className={col}>
                <Combobox
                    name={name}
                    value={value}
                    onChange={v => setValue(v)}
                    onBlur={onBlur}
                    autoFocus={autoFocus}
                    data={data}
                />
                {touched && error && <div className="invalid-feedback">{error}</div>}
            </Wrapper>
        </FormGroup>
    );
}

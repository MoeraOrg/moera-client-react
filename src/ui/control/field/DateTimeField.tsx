import React from 'react';
import { useField } from 'formik';
import DatePicker from 'react-datepicker';

import { FormGroup, Wrapper } from "ui/control";
import FieldError from "ui/control/field/FieldError";
import { Browser } from "ui/browser";
import "./DateTimeField.css";

interface Props {
    name: string;
    title?: string;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    autoFocus?: boolean;
}

export const DateTimeField = ({name, title, horizontal = false, groupClassName, labelClassName, col,
                               autoFocus}: Props) => {
    const [{onBlur}, {value, touched, error}, {setValue}] = useField<Date>(name);

    return (
        <FormGroup name={name} title={title} horizontal={horizontal} groupClassName={groupClassName}
                   labelClassName={labelClassName}>
            <Wrapper className={col}>
                <DatePicker
                    id={name}
                    name={name}
                    selected={value}
                    onChange={v => {
                        if (v instanceof Date) {
                            setValue(v);
                        }
                    }}
                    onBlur={onBlur}
                    autoFocus={autoFocus}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy, HH:mm"
                    portalId={!Browser.isTinyScreen() ? "modal-root" : undefined}
                    withPortal={Browser.isTinyScreen()}
                />
                {touched && <FieldError error={error}/>}
            </Wrapper>
        </FormGroup>
    );
}

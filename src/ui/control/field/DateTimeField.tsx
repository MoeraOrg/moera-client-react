import React, { Suspense } from 'react';
import { useField } from 'formik';

import { FormGroup, Wrapper } from "ui/control";
import FieldError from "ui/control/field/FieldError";
import { useIsTinyScreen } from "ui/hook/media-query";
import "./DateTimeField.css";

const DatePicker = React.lazy(() => import('react-datepicker'));

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
    const tinyScreen = useIsTinyScreen();

    return (
        <FormGroup name={name} title={title} horizontal={horizontal} groupClassName={groupClassName}
                   labelClassName={labelClassName}>
            <Wrapper className={col}>
                <Suspense fallback={null}>
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
                        portalId={!tinyScreen ? "modal-root" : undefined}
                        withPortal={tinyScreen}
                    />
                    {touched && <FieldError error={error}/>}
                </Suspense>
            </Wrapper>
        </FormGroup>
    );
}

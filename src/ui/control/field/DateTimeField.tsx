import React, { Suspense } from 'react';

import { FormGroup, FormGroupStyle, Wrapper } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";
import { useIsTinyScreen } from "ui/hook/media-query";

const DatePicker = React.lazy(() => import('react-datepicker'));

interface Props {
    name: string;
    title?: string;
    horizontal?: boolean;
    layout?: FormGroupStyle;
    groupClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    col?: string;
    autoFocus?: boolean;
    initialValue?: Date | null;
    defaultValue?: Date | null;
}

export const DateTimeField = ({
    name, title, horizontal = false, layout, groupClassName, labelClassName, inputClassName, col, autoFocus,
    initialValue, defaultValue
}: Props) => {
    const [
        {onBlur}, {value, touched, error}, {setValue}, {undo, reset, onUndo, onReset}
    ] = useUndoableField<Date>(name, initialValue, defaultValue);
    const tinyScreen = useIsTinyScreen();

    return (
        <FormGroup
            name={name}
            title={title}
            horizontal={horizontal}
            layout={layout}
            groupClassName={groupClassName}
            labelClassName={labelClassName}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <Wrapper className={col}>
                <Suspense fallback={null}>
                    <DatePicker
                        id={name}
                        name={name}
                        className={inputClassName}
                        selected={value}
                        onChange={v => {
                            if (v instanceof Date) {
                                setValue(v);
                            }
                        }}
                        onBlur={onBlur}
                        autoFocus={autoFocus}
                        showYearDropdown
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

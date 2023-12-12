import React, { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import cx from 'classnames';
import composeRefs from '@seznam/compose-react-refs';
import { TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

import { FormGroup, Wrapper } from "ui/control";
import { FormGroupStyle } from "ui/control/FormGroup";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";

export interface SelectFieldChoiceBase<T> {
    title: string | [string, TOptions];
    value: T;
}

export type SelectFieldChoice = SelectFieldChoiceBase<string>;

interface Props {
    name: string;
    title?: string;
    horizontal?: boolean;
    layout?: FormGroupStyle;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    size?: string;
    choices?: SelectFieldChoice[],
    multiple?: boolean;
    autoFocus?: boolean;
    anyValue?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    initialValue?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    setting?: string;
}

function SelectFieldImpl(
    {
        name, title, horizontal = false, layout, groupClassName, labelClassName, col, size, choices = [], multiple,
        autoFocus, anyValue, className, autoComplete, noFeedback = false, initialValue, defaultValue, disabled, setting
    }: Props,
    ref: ForwardedRef<HTMLSelectElement>
) {
    const {t} = useTranslation();

    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (autoFocus && selectRef.current != null) {
            selectRef.current.focus();
        }
    }, [autoFocus]);

    const [inputProps, {touched, error}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            horizontal={horizontal}
            layout={layout}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            undo={undo}
            reset={reset}
            setting={setting}
            onUndo={onUndo}
            onReset={onReset}
        >
            <Wrapper className={col}>
                <select
                    {...inputProps}
                    id={name}
                    className={cx(
                        "form-select", {
                            "form-select-sm": size === "sm",
                            "form-select-lg": size === "lg",
                            "is-valid": !anyValue && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        })}
                    multiple={multiple}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    ref={composeRefs(ref, selectRef)}
                >
                    {choices.map((c, index) =>
                        <option key={index} value={c.value}>
                            {Array.isArray(c.title) ? t(c.title[0], c.title[1]) : t(c.title)}
                        </option>
                    )}
                </select>
                {!noFeedback && touched && <FieldError error={error}/>}
            </Wrapper>
        </FormGroup>
    );
}

const SelectField = forwardRef(SelectFieldImpl);

export { SelectField };

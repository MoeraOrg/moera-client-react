import React, { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import cx from 'classnames';
import composeRefs from '@seznam/compose-react-refs';

import { FormGroup, Wrapper } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";

interface Props {
    name: string;
    title?: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    autoFocus?: boolean;
    anyValue?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    initialValue?: string | null;
    defaultValue?: string | null;
}

function InputFieldImpl(
    {
        name, title, placeholder, disabled, maxLength, horizontal = false, groupClassName, labelClassName, col,
        autoFocus, anyValue, className, autoComplete, noFeedback = false, initialValue, defaultValue
    }: Props,
    ref: ForwardedRef<HTMLInputElement>
) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current != null) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const [inputProps, {touched, error}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            horizontal={horizontal}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <Wrapper className={col}>
                <input
                    {...inputProps}
                    id={name}
                    type={!name.toLowerCase().includes("password") ? "text" : "password"}
                    className={cx(
                        "form-control", {
                            "is-valid": !anyValue && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        })}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    maxLength={maxLength}
                    ref={composeRefs(ref, inputRef)}
                />
                {!noFeedback && touched && <FieldError error={error}/>}
            </Wrapper>
        </FormGroup>
    );
}

const InputField = forwardRef(InputFieldImpl);

export { InputField };

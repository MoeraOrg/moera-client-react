import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { FormGroup, TextareaAutosize } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";

interface Props {
    name: string;
    title?: string;
    rows?: number;
    maxHeight?: string;
    maxLength?: number;
    placeholder?: string;
    autoFocus?: boolean;
    anyValue?: boolean;
    errorsOnly?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    disabled?: boolean;
    groupClassName?: string;
    initialValue?: string | null;
    defaultValue?: string | null;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

export function TextField({
    name, title, rows = 3, maxHeight, maxLength, placeholder, autoFocus, anyValue, errorsOnly, className, autoComplete,
    noFeedback = false, disabled = false, groupClassName, initialValue, defaultValue, onKeyDown
}: Props) {

    const {t} = useTranslation();

    placeholder = placeholder ?? t("enter-text-here");

    const inputDom = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && !disabled && inputDom.current != null) {
            inputDom.current.focus();
        }
    }, [autoFocus, disabled]);

    const [inputProps, {touched, error}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            groupClassName={groupClassName}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <>
                <TextareaAutosize
                    {...inputProps}
                    id={name}
                    className={cx(
                        "form-control", {
                            "is-valid": !anyValue && !errorsOnly && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        })}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    rows={rows}
                    style={{maxHeight: maxHeight ?? "30em"}}
                    maxLength={maxLength}
                    disabled={disabled}
                    onKeyDown={onKeyDown}
                    ref={inputDom}
                />
                {!noFeedback && touched && <FieldError error={error}/>}
            </>
        </FormGroup>
    );
}

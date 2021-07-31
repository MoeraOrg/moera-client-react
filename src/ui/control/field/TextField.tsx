import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";

interface Props {
    name: string;
    title?: string;
    rows?: number;
    placeholder?: string;
    autoFocus?: boolean;
    anyValue?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    disabled?: boolean;
    initialValue?: string | null;
    defaultValue?: string | null;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

export function TextField({name, title, rows = 3, placeholder = "Enter text here...", autoFocus, anyValue, className,
                           autoComplete, noFeedback = false, disabled = false, initialValue, defaultValue,
                           onKeyDown}: Props) {

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
                            "is-valid": !anyValue && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        })}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    rows={rows}
                    maxRows={20}
                    disabled={disabled}
                    onKeyDown={onKeyDown}
                    ref={inputDom}
                />
                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
            </>
        </FormGroup>
    );
}

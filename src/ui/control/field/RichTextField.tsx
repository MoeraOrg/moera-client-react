import React from 'react';
import cx from 'classnames';

import { RichTextEditor } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import { SourceFormat } from "api/node/api-types";

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
    initialValue?: string;
    defaultValue?: string;
    smileysEnabled?: boolean;
    hidingPanel?: boolean;
    format: SourceFormat;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

export function RichTextField({name, title, rows = 3, placeholder = "Enter text here...", autoFocus, anyValue,
                               className, autoComplete, noFeedback = false, disabled = false, initialValue,
                               defaultValue, smileysEnabled, hidingPanel, format, onKeyDown}: Props) {
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
                <RichTextEditor
                    {...inputProps}
                    className={cx(
                        "form-control", {
                            "is-valid": !anyValue && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        })}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    smileysEnabled={smileysEnabled}
                    hidingPanel={hidingPanel}
                    format={format}
                    onKeyDown={onKeyDown}
                />
                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
            </>
        </FormGroup>
    );
}

import React from 'react';
import cx from 'classnames';

import { RichTextEditor, RichTextValue } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import { SourceFormat } from "api/node/api-types";

interface Props {
    name: string;
    title?: string;
    rows?: number;
    noMedia?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    anyValue?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    disabled?: boolean;
    initialValue?: RichTextValue;
    defaultValue?: RichTextValue;
    smileysEnabled?: boolean;
    hidingPanel?: boolean;
    format: SourceFormat;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

export function RichTextField({name, title, rows = 3, noMedia, placeholder = "Enter text here...", autoFocus, anyValue,
                               className, autoComplete, noFeedback = false, disabled = false, initialValue,
                               defaultValue, smileysEnabled, hidingPanel, format, onKeyDown}: Props) {
    const [{value, onBlur}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<RichTextValue>(name, initialValue, defaultValue);

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
                    name={name}
                    value={value}
                    onChange={v => setValue(v)}
                    onBlur={onBlur}
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
                    noMedia={noMedia}
                />
                {!noFeedback && touched && error && <div className="invalid-feedback">{(error as any).text}</div>}
            </>
        </FormGroup>
    );
}

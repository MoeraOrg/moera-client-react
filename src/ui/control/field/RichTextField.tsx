import React, { useCallback } from 'react';
import cx from 'classnames';
import { useFormikContext } from 'formik';

import { PostingFeatures, SourceFormat } from "api/node/api-types";
import { FormGroup, RichTextEditor, RichTextValue } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";

interface Props {
    name: string;
    title?: string;
    rows?: number;
    features?: PostingFeatures | null;
    noMedia?: boolean;
    nodeName?: string | null;
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

export function RichTextField({name, title, rows = 3, features, noMedia, nodeName, placeholder = "Enter text here...",
                               autoFocus, anyValue, className, autoComplete, noFeedback = false, disabled = false,
                               initialValue, defaultValue, smileysEnabled, hidingPanel, format, onKeyDown}: Props) {
    const [{value, onBlur}, {touched, error}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<RichTextValue>(name, initialValue, defaultValue);
    const {setFieldValue} = useFormikContext();

    // useCallback() and setFieldValue() (not setValue()) is mandatory here
    const onChange = useCallback(v => setFieldValue(name, v), [name, setFieldValue]);

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
                    onChange={onChange}
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
                    features={features ?? null}
                    disabled={disabled}
                    smileysEnabled={smileysEnabled}
                    hidingPanel={hidingPanel}
                    format={format}
                    onKeyDown={onKeyDown}
                    noMedia={noMedia}
                    nodeName={nodeName}
                />
                {!noFeedback && touched && error && <div className="invalid-feedback">{(error as any).text}</div>}
            </>
        </FormGroup>
    );
}

import React from 'react';
import { NumberPicker } from 'react-widgets';

import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import "./NumberField.css";

interface Props {
    name: string;
    title?: string;
    horizontal?: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    format?: any; // FIXME hack due to bug in react-widgets type definition
    min?: number | null;
    max?: number | null;
    step?: number | null;
    initialValue?: number | null;
    defaultValue?: number | null;
}

export const NumberField = ({name, title, horizontal, autoFocus, disabled, format, min, max, step, initialValue,
                             defaultValue}: Props) => {
    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<number>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            horizontal={horizontal}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <>
                {/* <label> is not functional, because NumberPicker doesn't allow to set id */}
                <div className="number-control">
                    <NumberPicker
                        name={name}
                        value={value}
                        onChange={v => v != null && setValue(v)}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        format={format}
                        min={min ?? undefined}
                        max={max ?? undefined}
                        step={step ?? 1}
                    />
                </div>
                {touched && error && <div className="invalid-feedback">{error}</div>}
            </>
        </FormGroup>
    );
}

import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import "./CheckboxField.css";

interface Props {
    name: string;
    title?: string;
    disabled?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    autoFocus?: boolean;
    single?: boolean;
    initialValue?: boolean;
    defaultValue?: boolean;
}

export function CheckboxField({name, title, disabled, groupClassName, labelClassName, autoFocus, single, initialValue,
                               defaultValue}: Props) {

    const inputDom = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputDom.current != null) {
            inputDom.current.focus();
        }
    }, [autoFocus]);

    const [{value, onChange, onBlur}, {touched, error}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<boolean>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            checkbox={!single}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <>
                <input
                    name={name}
                    checked={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    id={name}
                    type="checkbox"
                    disabled={disabled}
                    className={cx({
                        "form-check-input": !single,
                        "form-control": single,
                        "checkbox-control-single": single
                    })}
                    ref={inputDom}
                />
                {touched && error && <div className="invalid-feedback">{error}</div>}
            </>
        </FormGroup>
    );
}

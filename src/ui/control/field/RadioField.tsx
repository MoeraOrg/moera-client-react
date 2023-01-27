import React from 'react';
import cx from 'classnames';

import { FormGroup } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import "./CheckboxField.css";

interface Props<V> {
    id?: string;
    name: string;
    title?: string;
    titleHtml?: string;
    isChecked?: (value: V) => boolean;
    onChange?: () => void;
    value?: string | number;
    disabled?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    autoFocus?: boolean;
    single?: boolean;
    anyValue?: boolean;
    initialValue?: V | null;
    defaultValue?: V | null;
    setting?: string;
}

export function RadioField<V = boolean>({
    id, name, title, titleHtml, isChecked, onChange: onInputChange, value: inputValue, disabled, groupClassName,
    labelClassName, autoFocus, single, anyValue, initialValue, defaultValue, setting
}: Props<V>) {
    const [{value, onChange, onBlur}, {touched, error}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<V>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            titleHtml={titleHtml}
            name={name}
            labelFor={id}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            layout={single ? "follow" : "right"}
            undo={undo}
            reset={reset}
            setting={setting}
            onUndo={onUndo}
            onReset={onReset}
        >
            <input
                type="radio"
                name={name}
                checked={isChecked ? isChecked(value) : Boolean(value)}
                value={inputValue}
                onChange={e => {
                    onInputChange && onInputChange();
                    onChange && onChange(e);
                }}
                onBlur={onBlur}
                id={id ?? name}
                disabled={disabled}
                autoFocus={autoFocus}
                className={cx({
                    "form-check-input": !single,
                    "form-control": single,
                    "is-valid": !anyValue && touched && !error,
                    "is-invalid": !anyValue && touched && error
                })}
            />
        </FormGroup>
    );
}

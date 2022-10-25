import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import { FormGroup } from "ui/control/FormGroup";
import { useUndoableField } from "ui/control/field/undoable-field";
import "./CheckboxField.css";

interface Props {
    name: string;
    title?: string;
    titleHtml?: string;
    disabled?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    autoFocus?: boolean;
    single?: boolean;
    anyValue?: boolean;
    initialValue?: boolean | null;
    defaultValue?: boolean | null;
    setting?: string;
}

export function CheckboxField({
    name, title, titleHtml, disabled, groupClassName, labelClassName, autoFocus, single, anyValue, initialValue,
    defaultValue, setting
}: Props) {
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
            titleHtml={titleHtml}
            name={name}
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
                    "is-valid": !anyValue && touched && !error,
                    "is-invalid": !anyValue && touched && error,
                    "checkbox-control-single": single
                })}
                ref={inputDom}
            />
        </FormGroup>
    );
}

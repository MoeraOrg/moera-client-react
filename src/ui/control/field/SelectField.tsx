import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import { Wrapper } from "ui/control/index";
import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";

interface Choice {
    title: string;
    value: string;
}

interface Props {
    name: string;
    title?: string;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    size?: string;
    choices?: Choice[],
    multiple?: boolean;
    autoFocus?: boolean;
    anyValue?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    initialValue?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    selectRef?: (dom: HTMLSelectElement | null) => void;
}

export function SelectField({name, title, horizontal = false, groupClassName, labelClassName, col, size, choices = [],
                             multiple, autoFocus, anyValue, className, autoComplete, noFeedback = false, initialValue,
                             defaultValue, disabled, selectRef}: Props) {

    const inputDom = useRef<HTMLSelectElement>();

    useEffect(() => {
        if (autoFocus && inputDom.current != null) {
            inputDom.current.focus();
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
                <select
                    {...inputProps}
                    id={name}
                    className={cx(
                        "form-select", {
                            "form-select-sm": size === "sm",
                            "form-select-lg": size === "lg",
                            "is-valid": !anyValue && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        })}
                    multiple={multiple}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    ref={dom => {
                        inputDom.current = dom ?? undefined;
                        if (selectRef != null) {
                            selectRef(dom);
                        }
                    }}
                >
                    {choices.map(c => <option key={c.value} value={c.value}>{c.title}</option>)}
                </select>
                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
            </Wrapper>
        </FormGroup>
    );
}

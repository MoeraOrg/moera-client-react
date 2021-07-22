import React from 'react';
import cx from 'classnames';

import { LabelButton } from "ui/control";

interface Props {
    title?: string;
    name?: string;
    className?: string;
    horizontal?: boolean;
    checkbox?: boolean;
    undo?: boolean;
    reset?: boolean;
    onUndo?: () => void;
    onReset?: () => void;
}

export const Label = ({title, name, className, horizontal, checkbox, undo, reset, onUndo, onReset}: Props) => (
    title ?
        <>
            <label htmlFor={name} className={cx(
                className, {
                    "col-form-label": horizontal,
                    "form-check-label": checkbox,
                    "checkbox-field-label": checkbox,
                    "mr-2": undo || reset
                })}>
                {title}
            </label>
            {undo && <LabelButton icon="undo-alt" className="form-label-button-undo"
                                  title="Undo" onClick={onUndo}/>}
            {reset && <LabelButton icon="backspace" className="form-label-button-reset"
                                   title="Reset to default" onClick={onReset}/>}
        </>
    :
        null
);

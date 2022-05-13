import React from 'react';
import cx from 'classnames';

import { LabelButton } from "ui/control/index";

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
    children?: any;
}

export const Label = ({title, name, className, horizontal, checkbox, undo, reset, onUndo, onReset,
                       children}: Props) => (
    title ?
        <>
            <label htmlFor={name} className={cx(
                className, {
                    "form-label": !horizontal,
                    "col-form-label": horizontal,
                    "form-check-label": checkbox,
                    "checkbox-field-label": checkbox,
                    "me-2": (undo || reset) && !horizontal,
                    "me-3": horizontal
                })}>
                {title}
            </label>
            {children}
            {undo && <LabelButton icon="undo-alt" className="form-label-button-undo"
                                  title="Undo" onClick={onUndo}/>}
            {reset && <LabelButton icon="backspace" className="form-label-button-reset"
                                   title="Reset to default" onClick={onReset}/>}
        </>
    :
        null
);

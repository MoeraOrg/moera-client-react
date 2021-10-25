import React from 'react';
import cx from 'classnames';

import { Label } from "ui/control/index";
import "./FormGroup.css";

interface Props {
    title?: string;
    name?: string;
    horizontal?: boolean;
    checkbox?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    undo?: boolean;
    reset?: boolean;
    onUndo?: () => void;
    onReset?: () => void;
    children: any;
}

export const FormGroup = ({title, name, horizontal = false, checkbox = false, groupClassName, labelClassName,
                           undo = false, reset = false, onUndo, onReset, children}: Props) => (
    <div className={cx(
            "form-group",
            groupClassName, {
                "d-flex": horizontal
            })}>
        {!checkbox &&
            <>
                <Label title={title} name={name} className={labelClassName} horizontal={horizontal}
                       undo={undo} reset={reset} onUndo={onUndo} onReset={onReset}/>
                {children}
            </>
        }
        {checkbox &&
            <div className="form-check">
                {children}
                <Label title={title} name={name} className={labelClassName} horizontal={horizontal} checkbox
                       undo={undo} reset={reset} onUndo={onUndo} onReset={onReset}/>
            </div>
        }
    </div>
);

import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { Label } from "ui/control";

export const FormGroup = ({title, name, horizontal = false, checkbox = false, groupClassName, labelClassName,
                           undo = false, reset = false, onUndo, onReset, children}) => (
    <div className={cx(
            "form-group",
            groupClassName, {
                "row": horizontal
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
                <Label title={title} name={name} className={labelClassName} horizontal={horizontal} checkbox={true}
                       undo={undo} reset={reset} onUndo={onUndo} onReset={onReset}/>
            </div>
        }
    </div>
);

FormGroup.propTypes = {
    title: PropType.string,
    name: PropType.string,
    horizontal: PropType.bool,
    groupClassName: PropType.string,
    labelClassName: PropType.string,
    children: PropType.element,
    undo: PropType.bool,
    reset: PropType.bool,
    onUndo: PropType.func,
    onReset: PropType.func
};

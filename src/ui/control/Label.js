import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { LabelButton } from "ui/control";

export const Label = ({title, name, className, horizontal, checkbox, undo, reset, onUndo, onReset}) => (
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

Label.propTypes = {
    title: PropType.string,
    name: PropType.string,
    className: PropType.string,
    horizontal: PropType.bool,
    checkbox: PropType.bool,
    undo: PropType.bool,
    reset: PropType.bool,
    onUndo: PropType.func,
    onReset: PropType.func
};

import React from 'react';
import cx from 'classnames';

import { LabelButton, Wrapper } from "ui/control";
import SetDefaultButton from "ui/control/field/SetDefaultButton";

interface Props {
    title?: string;
    name?: string;
    className?: string;
    horizontal?: boolean;
    checkbox?: boolean;
    undo?: boolean;
    reset?: boolean;
    setting?: string;
    onUndo?: () => void;
    onReset?: () => void;
    children?: any;
}

export const Label = ({title, name, className, horizontal, checkbox, undo, reset, setting, onUndo, onReset,
                       children}: Props) => (
    <>
        {title ?
            <>
                <label htmlFor={name} className={cx(
                    className, {
                        "form-label": !horizontal,
                        "col-form-label": horizontal,
                        "form-check-label": checkbox,
                        "checkbox-field-label": checkbox,
                        "me-2": (undo || reset || setting) && !horizontal,
                        "me-3": horizontal
                    })}>
                    {title}
                </label>
                {children}
            </>
        :
            children ?? null
        }
        <Wrapper className={cx({"ms-2 align-self-center": (undo || reset || setting) && horizontal && children})}>
            {undo &&
                <LabelButton icon="undo-alt" className="form-label-button-undo" title="Undo" onClick={onUndo}/>
            }
            {reset &&
                <LabelButton icon="backspace" className="form-label-button-reset" title="Reset to default"
                                   onClick={onReset}/>
            }
            {name &&
                <SetDefaultButton name={name} setting={setting}/>
            }
        </Wrapper>
    </>
);

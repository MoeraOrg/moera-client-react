import React from 'react';
import cx from 'classnames';

import { Label } from "ui/control/index";
import "./FormGroup.css";

export type FormGroupStyle = "follow" | "left" | "right";

interface Props {
    title?: string;
    titleHtml?: string;
    name?: string;
    horizontal?: boolean;
    layout?: FormGroupStyle;
    groupClassName?: string;
    labelClassName?: string;
    undo?: boolean;
    reset?: boolean;
    setting?: string;
    onUndo?: () => void;
    onReset?: () => void;
    children: any;
}

export const FormGroup = ({
    title, titleHtml, name, horizontal = false, layout = "follow", groupClassName, labelClassName, undo = false,
    reset = false, setting, onUndo, onReset, children
}: Props) => (
    <div className={cx(
            "form-group",
            groupClassName, {
                "d-flex": horizontal
            })}>
        {layout === "follow" &&
            <>
                <Label title={title} titleHtml={titleHtml} name={name} className={labelClassName}
                       horizontal={horizontal} undo={undo} reset={reset} setting={setting} onUndo={onUndo}
                       onReset={onReset}/>
                {children}
            </>
        }
        {layout === "left" &&
            <>
                <Label title={title} titleHtml={titleHtml} name={name} className={labelClassName}
                       horizontal={horizontal} undo={undo} reset={reset} setting={setting} onUndo={onUndo}
                       onReset={onReset}>
                    {children}
                </Label>
            </>
        }
        {layout === "right" &&
            <div className="form-check">
                {children}
                <Label title={title} titleHtml={titleHtml} name={name} className={labelClassName}
                       horizontal={horizontal} checkbox undo={undo} reset={reset} setting={setting} onUndo={onUndo}
                       onReset={onReset}/>
            </div>
        }
    </div>
);

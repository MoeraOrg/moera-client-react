import React from 'react';
import cx from 'classnames';

import { Label } from "ui/control";
import { LabelProps } from "ui/control/Label";
import "./FormGroup.css";

export type FormGroupStyle = "follow" | "follow-end" | "left" | "right";

type Props = Omit<LabelProps, "htmlFor" | "className" | "checkbox"> & {
    labelFor?: string;
    layout?: FormGroupStyle;
    groupClassName?: string;
    labelClassName?: string;
    children: any;
}

export function FormGroup({
    labelFor, horizontal, layout = "follow", groupClassName, labelClassName, children, ...props
}: Props) {
    const labelProps = {
        ...props,
        htmlFor: labelFor,
        className: labelClassName,
        horizontal: horizontal ?? false,
    };

    return (
        <div className={cx("form-group", groupClassName, {"d-flex": horizontal})}>
            {layout === "follow" &&
                <>
                    <Label {...labelProps}/>
                    {children}
                </>
            }
            {layout === "follow-end" &&
                <>
                    <div className="text-end">
                        <Label {...labelProps}/>
                    </div>
                    {children}
                </>
            }
            {layout === "left" &&
                <>
                    <Label {...labelProps}>
                        {children}
                    </Label>
                </>
            }
            {layout === "right" &&
                <div className="form-check">
                    {children}
                    <Label {...labelProps} checkbox/>
                </div>
            }
        </div>
    );
}

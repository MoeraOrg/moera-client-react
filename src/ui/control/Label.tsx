import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { msBackspaceFilled16, msRestartAlt16 } from "ui/material-symbols";
import { Information, LabelButton, Wrapper } from "ui/control";
import SetDefaultButton from "ui/control/field/SetDefaultButton";

export interface LabelProps {
    title?: string | React.ReactNode;
    name?: string;
    htmlFor?: string;
    className?: string;
    horizontal?: boolean;
    checkbox?: boolean;
    tooltip?: string;
    undo?: boolean;
    reset?: boolean;
    setting?: string;
    onUndo?: () => void;
    onReset?: () => void;
    children?: any;
}

export function Label({
    title, name, htmlFor, className, horizontal, checkbox, tooltip, undo, reset, setting, onUndo, onReset, children
}: LabelProps) {
    const {t} = useTranslation();

    return (
        <>
            {title ?
                <>
                    <label htmlFor={htmlFor ?? name} className={cx(
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
                {tooltip &&
                    <Information className="ms-1" text={tooltip}/>
                }
                {undo &&
                    <LabelButton icon={msRestartAlt16} className="form-label-button-undo" title={t("undo")}
                                 onClick={onUndo}/>
                }
                {reset &&
                    <LabelButton icon={msBackspaceFilled16} className="form-label-button-reset"
                                 title={t("reset-to-default")} onClick={onReset}/>
                }
                {(name && setting != null) &&
                    <SetDefaultButton name={name} setting={setting}/>
                }
            </Wrapper>
        </>
    );
}

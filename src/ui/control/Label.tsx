import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { LabelButton, Wrapper } from "ui/control";
import SetDefaultButton from "ui/control/field/SetDefaultButton";

interface Props {
    title?: string;
    titleHtml?: string;
    name?: string;
    htmlFor?: string;
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

export function Label({
    title, titleHtml, name, htmlFor, className, horizontal, checkbox, undo, reset, setting, onUndo, onReset, children
}: Props) {
    const {t} = useTranslation();

    return (
        <>
            {(title || titleHtml) ?
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
                        {titleHtml && <span dangerouslySetInnerHTML={{__html: titleHtml}}/>}
                    </label>
                    {children}
                </>
            :
                children ?? null
            }
            <Wrapper className={cx({"ms-2 align-self-center": (undo || reset || setting) && horizontal && children})}>
                {undo &&
                    <LabelButton icon="undo-alt" className="form-label-button-undo" title={t("undo")} onClick={onUndo}/>
                }
                {reset &&
                    <LabelButton icon="backspace" className="form-label-button-reset" title={t("reset-to-default")}
                                 onClick={onReset}/>
                }
                {(name && setting != null) &&
                    <SetDefaultButton name={name} setting={setting}/>
                }
            </Wrapper>
        </>
    );
}

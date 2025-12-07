import React, { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import composeRefs from '@seznam/compose-react-refs';

import { tTitle } from "i18n";
import { FormGroup, FormGroupStyle, Wrapper } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";
import { Icon, msVisibility, msVisibilityOff } from "ui/material-symbols";
import "./InputField.css";

interface Props {
    name: string;
    title?: string;
    placeholder?: string;
    tooltip?: string;
    type?: "text" | "password" | "email" | "url";
    disabled?: boolean;
    maxLength?: number;
    horizontal?: boolean;
    layout?: FormGroupStyle;
    groupClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    col?: string;
    autoFocus?: boolean;
    anyValue?: boolean;
    errorsOnly?: boolean;
    error?: string | null;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    initialValue?: string | null;
    defaultValue?: string | null;
}

function InputFieldImpl(
    {
        name, title, placeholder, tooltip, type = "text", disabled, maxLength, horizontal = false, layout,
        groupClassName, labelClassName, inputClassName, col, autoFocus, anyValue, errorsOnly, error: externalError,
        className, autoComplete, noFeedback = false, initialValue, defaultValue
    }: Props,
    ref: ForwardedRef<HTMLInputElement>
) {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const {t} = useTranslation();

    useEffect(() => {
        if (autoFocus && inputRef.current != null) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const [inputProps, {touched, error: fieldError}, , {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    const error = externalError ?? (touched ? fieldError : undefined);

    return (
        <FormGroup
            title={title}
            name={name}
            horizontal={horizontal}
            layout={layout}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            tooltip={tooltip}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <Wrapper className={col}>
                <Wrapper className={type === "password" ? "password-field" : undefined}>
                    <input
                        {...inputProps}
                        id={name}
                        type={type === "password" && showPassword ? "text" : type}
                        className={cx(
                            "form-control", {
                                "is-valid": !anyValue && !errorsOnly && !error,
                                "is-invalid": !anyValue && error,
                                [className!]: !!className
                            },
                            inputClassName
                        )}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        disabled={disabled}
                        maxLength={maxLength}
                        ref={composeRefs(ref, inputRef)}
                    />
                    {!noFeedback && error && <FieldError error={error}/>}
                    {type === "password" && (anyValue || (!error && errorsOnly)) &&
                        <button
                            className="show-password"
                            type="button"
                            title={tTitle(showPassword ? t("hide-password") : t("show-password"))}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Icon icon={showPassword ? msVisibility : msVisibilityOff} size="2em"/>
                        </button>
                    }
                </Wrapper>
            </Wrapper>
        </FormGroup>
    );
}

const InputField = forwardRef(InputFieldImpl);

export { InputField };

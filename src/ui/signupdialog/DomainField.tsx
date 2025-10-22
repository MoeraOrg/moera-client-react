import React, { useEffect, useRef } from 'react';
import { useField } from 'formik';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import PROVIDERS from "providers";
import { Button, FormGroup } from "ui/control";
import FieldError from "ui/control/field/FieldError";
import "./DomainField.css";

interface Props {
    name: string;
    title?: string;
    disabled?: boolean;
    onDomainInput?: (value: string) => void;
    onDomainBlur?: (value: string) => void;
    onAutoChange?: (value: boolean) => void;
}

export default function DomainField({name, title, disabled, onDomainInput, onDomainBlur, onAutoChange}: Props) {
    const inputDom = useRef<HTMLInputElement>();
    const {t} = useTranslation();

    const onInputInput = (event: Event) => {
        if (onDomainInput) {
            onDomainInput((event.target as HTMLInputElement)?.value);
        }
    }

    const onInputBlur = (event: Event) => {
        if (onDomainBlur) {
            onDomainBlur((event.target as HTMLInputElement)?.value);
        }
    }

    function setInputRef(dom: HTMLInputElement | null) {
        if (dom != null) {
            inputDom.current = dom;
            if (inputDom.current) {
                inputDom.current.addEventListener("input", onInputInput);
                inputDom.current.addEventListener("blur", onInputBlur);
            }
        }
    }

    useEffect(() => {
        return () => {
            if (inputDom.current) {
                inputDom.current.removeEventListener("input", onInputInput);
                inputDom.current.removeEventListener("blur", onInputBlur);
            }
        }
    });

    const [inputProps, {touched, error}] = useField<string>(name);
    const {value} = inputProps;
    const [{value: autoDomainValue}, , {setValue: setAutoDomainValue}] = useField<boolean>("autoDomain");
    const [{value: providerValue}] = useField<string>("provider");

    const onAutoClick = () => {
        const auto = !autoDomainValue;
        setAutoDomainValue(auto);
        if (onAutoChange) {
            onAutoChange(auto);
        }
    }

    const suffix = "." + (PROVIDERS.find(p => p.name === providerValue)?.domain ?? "");

    return (
        <FormGroup title={title} name={name} groupClassName="position-relative">
            <>
                <div className={cx("domain-field", {"is-invalid": touched && error})}>
                    {autoDomainValue ?
                        value && <div className="hostname">{value}</div>
                    :
                        <input
                            {...inputProps}
                            type="text"
                            className={cx(
                                "domain",
                                "form-control", {
                                    "is-invalid": touched && error,
                                })}
                            disabled={disabled}
                            ref={setInputRef}
                        />
                    }
                    <div className="suffix">{suffix}</div>
                    <Button variant="tool" size="sm" onClick={onAutoClick}>
                        {autoDomainValue ? t("change") : t("auto")}
                    </Button>
                </div>
                {touched && <FieldError error={error}/>}
            </>
        </FormGroup>
    );
}

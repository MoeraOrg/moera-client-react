import React from 'react';

import { PrincipalValue, SettingMetaInfo } from "api/node/api-types";
import { ClientSettingMetaInfo } from "api/settings";
import {
    CheckboxField,
    DurationField,
    EmojiListInputField,
    InfoQuantityField,
    InputField,
    NumberField, PrincipalField,
    SelectField,
    TextField
} from "ui/control/field";
import { isNumber, parseBool } from "util/misc";

function deserializeBool(value: string | boolean | null | undefined): boolean | null {
    return value != null ? parseBool(value) : null;
}

function deserializeInt(value: string | number | null | undefined): number | null {
    if (isNumber(value)) {
        return value;
    }
    return value != null ? parseInt(value) : null;
}

function deserializePrincipal(value: string | null | undefined): PrincipalValue | null {
    return (value ?? null) as PrincipalValue | null;
}

function convertFormat(format: string | null | undefined) {
    switch (format) {
        case "percentage":
            return {style: "unit", unit: "percent", minimumFractionDigits: 0};
        default:
            return null;
    }
}

interface Props {
    name: string;
    fieldName: string;
    meta?: SettingMetaInfo | ClientSettingMetaInfo | null;
    initialValue?: string | null;
    groupClassName?: string;
}

export default function SettingsField({name, fieldName, meta, initialValue, groupClassName}: Props) {
    const type = meta ? meta.type : "string";
    const privileged = meta != null && "privileged" in meta && meta.privileged;
    const title = meta ? meta.title + (privileged ? " (provider setting)" : "") : name;
    const defaultValue = meta ? meta.defaultValue : null;
    const disabled = meta ? privileged : false;
    const modifiers = meta && meta.modifiers ? meta.modifiers : {};
    switch (type) {
        case "bool":
            return <CheckboxField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                                  initialValue={deserializeBool(initialValue)}
                                  defaultValue={deserializeBool(defaultValue)}/>;

        case "int":
            if (modifiers.format) {
                switch (modifiers.format) {
                    case "size":
                        return <InfoQuantityField name={fieldName} title={title} disabled={disabled}
                                                  groupClassName={groupClassName}
                                                  min={deserializeInt(modifiers.min)}
                                                  max={deserializeInt(modifiers.max)}
                                                  initialValue={deserializeInt(initialValue)}
                                                  defaultValue={deserializeInt(defaultValue)}/>;
                    default:
                        // continue
                }
            }
            return <NumberField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                                min={deserializeInt(modifiers.min)}
                                max={deserializeInt(modifiers.max)}
                                step={"step" in modifiers ? deserializeInt(modifiers.step) : undefined}
                                format={convertFormat(modifiers.format)}
                                initialValue={deserializeInt(initialValue)}
                                defaultValue={deserializeInt(defaultValue)}/>;

        case "string":
            if (modifiers.format) {
                switch (modifiers.format) {
                    default:
                        return <InputField name={fieldName} title={title} disabled={disabled}
                                           groupClassName={groupClassName} initialValue={initialValue}
                                           defaultValue={defaultValue} anyValue/>;
                    case "select":
                        return <SelectField name={fieldName} title={title} disabled={disabled}
                                            groupClassName={groupClassName}
                                            choices={"items" in modifiers ? modifiers.items : undefined}
                                            initialValue={initialValue} defaultValue={defaultValue} anyValue/>
                    case "emoji-list-positive":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled}
                                                    groupClassName={groupClassName} negative={false}
                                                    initialValue={initialValue} defaultValue={defaultValue}/>;
                    case "emoji-list-negative":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled}
                                                    groupClassName={groupClassName} negative={true}
                                                    initialValue={initialValue} defaultValue={defaultValue}/>;
                    case "emoji-list-positive-advanced":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled}
                                                    groupClassName={groupClassName} negative={false} advanced={true}
                                                    initialValue={initialValue} defaultValue={defaultValue}/>;
                    case "emoji-list-negative-advanced":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled}
                                                    groupClassName={groupClassName} negative={true} advanced={true}
                                                    initialValue={initialValue} defaultValue={defaultValue}/>;
                }
            } else if (modifiers.multiline) {
                return <TextField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                                  initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
            } else {
                return <InputField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                                   initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
            }

        case "Duration":
            return <DurationField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                                  min={modifiers.min} max={modifiers.max} never={modifiers.never}
                                  always={modifiers.always} initialValue={initialValue} defaultValue={defaultValue}/>;

        case "Principal":
            return <PrincipalField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                                   values={modifiers.principals}
                                   initialValue={deserializePrincipal(initialValue)}
                                   defaultValue={deserializePrincipal(defaultValue)} long/>;

        default:
            return <InputField name={fieldName} title={title} disabled={disabled} groupClassName={groupClassName}
                               initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
    }
}

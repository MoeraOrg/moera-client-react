import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { PrincipalValue, SettingMetaInfo, SettingType, SettingTypeModifiers } from "api/node/api-types";
import { ClientSettingMetaInfo, ClientSettingTypeModifiers } from "api/settings";
import {
    CheckboxField,
    DurationField,
    EmojiListInputField,
    InfoQuantityField,
    InputField,
    NumberField,
    PrincipalField,
    SelectField,
    TextField
} from "ui/control/field";
import { isNumber, parseBool } from "util/misc";
import { InfoQuantity } from "util/info-quantity";
import { Duration } from "util/duration";

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

function valueRange(type: SettingType, modifiers: SettingTypeModifiers | ClientSettingTypeModifiers,
                    t: TFunction): string {
    let min: number | string | null = null;
    let max: number | string | null = null;

    switch (type) {
        case "int":
            min = deserializeInt(modifiers.min);
            max = deserializeInt(modifiers.max);
            switch (modifiers.format) {
                case "size":
                    min = min != null ? InfoQuantity.ofBytes(min).toString() : null;
                    max = max != null ? InfoQuantity.ofBytes(max).toString() : null;
                    break;

                case "percentage":
                    min = min != null ? `${min}%` : null;
                    max = max != null ? `${max}%` : null;
                    break;
            }
            break;

        case "Duration":
            min = modifiers.min != null ? Duration.parse(modifiers.min).toReadableString(t) : null;
            max = modifiers.max != null ? Duration.parse(modifiers.max).toReadableString(t) : null;
            break;
    }

    if (min != null) {
        if (max != null) {
            return ` [${min} \u2013 ${max}]`;
        } else {
            return ` [\u2265 ${min}]`;
        }
    } else {
        if (max != null) {
            return ` [\u2264 ${max}]`;
        } else {
            return "";
        }
    }
}

interface Props {
    name: string;
    fieldName: string;
    titleName: string;
    meta?: SettingMetaInfo | ClientSettingMetaInfo | null;
    initialValue?: string | null;
    groupClassName?: string;
}

export default function SettingsField({name, fieldName, titleName, meta, initialValue, groupClassName}: Props) {
    const {t} = useTranslation();

    const type: SettingType = meta ? meta.type : "string";
    const modifiers = meta && meta.modifiers ? meta.modifiers : {};
    const privileged = meta != null && "privileged" in meta && meta.privileged;
    const title = t(titleName, {defaultValue: meta ? meta.title : name})
        + (privileged ? " " + t("provider-setting") : "")
        + valueRange(type, modifiers, t);
    const defaultValue = meta ? meta.defaultValue : null;
    const disabled = meta ? privileged : false;
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
                    case "select": {
                        let items = undefined;
                        if ("items" in modifiers && modifiers.items != null) {
                            items = modifiers.items.map(item => ({
                                title: t(`${titleName}-items.${item.value}`, {defaultValue: item.title}),
                                value: item.value
                            }));
                        }
                        return <SelectField name={fieldName} title={title} disabled={disabled}
                                            groupClassName={groupClassName} choices={items}
                                            initialValue={initialValue} defaultValue={defaultValue} anyValue/>
                    }
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

import React from 'react';

import {
    CheckboxField,
    DurationField,
    EmojiListInputField,
    InputField,
    NumberField, SelectField,
    TextField
} from "ui/control/field";
import { parseBool } from "util/misc";

function deserializeBool(value) {
    return value != null ? parseBool(value) : null;
}

function deserializeInt(value) {
    return value != null ? parseInt(value) : null;
}

function convertFormat(format) {
    switch (format) {
        case "percentage":
            return {style: "unit", unit: "percent", minimumFractionDigits: 0};
        default:
            return null;
    }
}

export default function SettingsField({name, fieldName, meta, initialValue}) {
    const type = meta ? meta.type : "string";
    const title = meta ? meta.title + (meta.privileged ? " (provider setting)" : "") : name;
    const defaultValue = meta ? meta.defaultValue : null;
    const disabled = meta ? meta.privileged : false;
    const modifiers = meta && meta.modifiers ? meta.modifiers : {};
    switch (type) {
        case "bool":
            return <CheckboxField name={fieldName} title={title} disabled={disabled}
                                  initialValue={deserializeBool(initialValue)}
                                  defaultValue={deserializeBool(defaultValue)}/>;

        case "int":
            return <NumberField name={fieldName} title={title} disabled={disabled}
                                min={deserializeInt(modifiers.min)}
                                max={deserializeInt(modifiers.max)}
                                step={deserializeInt(modifiers.step)}
                                format={convertFormat(modifiers.format)}
                                initialValue={deserializeInt(initialValue)}
                                defaultValue={deserializeInt(defaultValue)}/>;

        case "string":
            if (modifiers.format) {
                switch (modifiers.format) {
                    default:
                        return <InputField name={fieldName} title={title} disabled={disabled}
                                           initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                    case "select":
                        return <SelectField name={fieldName} title={title} disabled={disabled} choices={modifiers.items}
                                            initialValue={initialValue} defaultValue={defaultValue} anyValue/>
                    case "emoji-list-positive":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled} negative={false}
                                                    initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                    case "emoji-list-negative":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled} negative={true}
                                                    initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                    case "emoji-list-positive-advanced":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled} negative={false}
                                                    advanced={true} initialValue={initialValue}
                                                    defaultValue={defaultValue} anyValue/>;
                    case "emoji-list-negative-advanced":
                        return <EmojiListInputField name={fieldName} title={title} disabled={disabled} negative={true}
                                                    advanced={true} initialValue={initialValue}
                                                    defaultValue={defaultValue} anyValue/>;
                }
            } else if (modifiers.multiline) {
                return <TextField name={fieldName} title={title} disabled={disabled}
                                  initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
            } else {
                return <InputField name={fieldName} title={title} disabled={disabled}
                                   initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
            }

        case "Duration":
            return <DurationField name={fieldName} title={title} disabled={disabled} min={modifiers.min}
                                  max={modifiers.max} never={modifiers.never} always={modifiers.always}
                                  initialValue={initialValue} defaultValue={defaultValue}/>;

        default:
            return <InputField name={fieldName} title={title} disabled={disabled}
                               initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
    }
}

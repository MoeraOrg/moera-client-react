import React from 'react';

import {
    CheckboxField,
    DurationField,
    EmojiListInputField,
    InputField,
    NumberField,
    TextField
} from "ui/control/field";
import { parseBool } from "util/misc";

function deserializeBool(value) {
    return value != null ? parseBool(value) : null;
}

function deserializeInt(value) {
    return value != null ? parseInt(value) : null;
}

const SettingsField = ({name, fieldName, meta, initialValue}) => {
    const type = meta ? meta.type : "string";
    const title = meta ? meta.title : name;
    const defaultValue = meta ? meta.defaultValue : null;
    const modifiers = meta && meta.modifiers ? meta.modifiers : {};
    switch (type) {
        case "bool":
            return <CheckboxField name={fieldName} title={title} single={true}
                                  initialValue={deserializeBool(initialValue)}
                                  defaultValue={deserializeBool(defaultValue)}/>;

        case "int":
            return <NumberField name={fieldName} title={title}
                                min={deserializeInt(modifiers.min)}
                                max={deserializeInt(modifiers.max)}
                                initialValue={deserializeInt(initialValue)}
                                defaultValue={deserializeInt(defaultValue)}/>;

        case "string":
            if (modifiers.format) {
                switch (modifiers.format) {
                    case "emoji-list-positive":
                        return <EmojiListInputField name={fieldName} title={title} negative={false}
                                                    initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                    case "emoji-list-negative":
                        return <EmojiListInputField name={fieldName} title={title} negative={true}
                                                    initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                    case "emoji-list-positive-advanced":
                        return <EmojiListInputField name={fieldName} title={title} negative={false} advanced={true}
                                                    initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                    case "emoji-list-negative-advanced":
                        return <EmojiListInputField name={fieldName} title={title} negative={true} advanced={true}
                                                    initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
                }
            } else if (modifiers.multiline) {
                return <TextField name={fieldName} title={title}
                                  initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
            } else {
                return <InputField name={fieldName} title={title}
                                   initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
            }
            break;

        case "Duration":
            return <DurationField name={fieldName} title={title} min={modifiers.min} max={modifiers.max}
                                  initialValue={initialValue} defaultValue={defaultValue}/>;

        default:
            return <InputField name={fieldName} title={title}
                               initialValue={initialValue} defaultValue={defaultValue} anyValue/>;
    }
};

export default SettingsField;

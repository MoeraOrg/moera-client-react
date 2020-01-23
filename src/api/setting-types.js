import { parseBool } from "util/misc";
import Duration from "util/duration";

export function toValue(type, valueString) {
    switch (type) {
        case "bool":
            return parseBool(valueString);

        case "int":
            return parseInt(valueString) || 0;

        default:
            return valueString || "";
    }
}

export function validate(value, type, modifiers) {
    if (!modifiers) {
        return true;
    }

    switch (type) {
        case "int":
            if (modifiers.min && value < modifiers.min) {
                return "The value must be not less than " + modifiers.min;
            }
            if (modifiers.max && value > modifiers.max) {
                return "The value must be not more than " + modifiers.max;
            }
            return true;

        case "Duration":
            if (modifiers.min && Duration.parse(value).toSeconds() < Duration.parse(modifiers.min).toSeconds()) {
                return "The value must be not less than " + modifiers.min;
            }
            if (modifiers.max && Duration.parse(value).toSeconds() > Duration.parse(modifiers.max).toSeconds()) {
                return "The value must be not more than " + modifiers.max;
            }
            return true;

        default:
            return true;
    }
}

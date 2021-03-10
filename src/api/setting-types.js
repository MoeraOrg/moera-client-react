import { fromUnixTime } from 'date-fns';

import { parseBool } from "util/misc";
import Duration from "util/duration";

export function toValue(type, valueString) {
    switch (type) {
        case "bool":
            return parseBool(valueString);

        case "int":
            return parseInt(valueString) || 0;

        case "timestamp":
            return fromUnixTime(parseInt(valueString) || 0);

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

        case "Duration": {
            const duration = Duration.parse(value);
            if (modifiers.min && duration.isFixed()
                    && duration.toSeconds() < Duration.parse(modifiers.min).toSeconds()) {
                return "The value must be not less than " + modifiers.min;
            }
            if (modifiers.max && duration.isFixed()
                    && duration.toSeconds() > Duration.parse(modifiers.max).toSeconds()) {
                return "The value must be not more than " + modifiers.max;
            }
            if (!modifiers.never && duration.isNever()) {
                return "The value cannot be 'never'";
            }
            if (!modifiers.always && duration.isAlways()) {
                return "The value cannot be 'always'";
            }
            return true;
        }

        default:
            return true;
    }
}

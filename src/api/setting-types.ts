import { fromUnixTime } from 'date-fns';
import { isString } from 'formik';

import { PrincipalValue, SettingType, SettingTypeModifiers } from "api/node/api-types";
import { ClientSettingTypeModifiers } from "api/settings";
import { Duration } from "util/duration";
import { InfoQuantity } from "util/info-quantity";
import { isNumber, parseBool } from "util/misc";

export type SettingValue = boolean | number | Date | string | PrincipalValue;
type SettingModifiers = SettingTypeModifiers | ClientSettingTypeModifiers;

export function toValue(type: SettingType, valueString: string): SettingValue {
    switch (type) {
        case "bool":
            return parseBool(valueString);

        case "int":
            return parseInt(valueString) || 0;

        case "Timestamp":
            return fromUnixTime(parseInt(valueString) || 0);

        case "json":
            return JSON.parse(valueString);

        default:
            return valueString || "";
    }
}

export function toFieldValue(type: SettingType, valueString: string,
                             modifiers: SettingModifiers | null | undefined): SettingValue {
    if (!modifiers) {
        return toValue(type, valueString);
    }

    switch (type) {
        case "int":
            if (modifiers.format === "size") {
                return InfoQuantity.ofBytes(parseInt(valueString) || 0).toString();
            }
            return toValue(type, valueString);

        default:
            return toValue(type, valueString);
    }
}

function deserializeInt(value: string | number): number {
    return isNumber(value) ? value : parseInt(value);
}

export function validate(value: SettingValue, type: SettingType,
                         modifiers: SettingModifiers | null | undefined): true | string {
    if (!modifiers) {
        return true;
    }

    switch (type) {
        case "int": {
            if (!isNumber(value) && !isString(value)) {
                return "The value must be a number";
            }
            const v = modifiers.format === "size" ? InfoQuantity.parse(value).toBytes() : value;
            if (!isNumber(v)) {
                return "The value must be a number";
            }
            if (modifiers.min && v < deserializeInt(modifiers.min)) {
                return "The value must be not less than " + modifiers.min;
            }
            if (modifiers.max && v > deserializeInt(modifiers.max)) {
                return "The value must be not more than " + modifiers.max;
            }
            return true;
        }

        case "Duration": {
            if (!isString(value)) {
                return "The value must be a string";
            }
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

export function toString(value: SettingValue, type: SettingType,
                         modifiers: SettingModifiers | null | undefined): string {
    if (!modifiers) {
        return value.toString();
    }

    switch (type) {
        case "int":
            if (modifiers.format === "size") {
                return InfoQuantity.parse(value.toString()).toBytes().toString();
            }
            return value.toString();

        default:
            return value.toString();
    }
}

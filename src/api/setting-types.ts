import { fromUnixTime } from 'date-fns';

import { SettingType, SettingTypeModifiers } from "api/node/api-types";
import { isNumber, parseBool } from "util/misc";
import { Duration } from "util/duration";
import { isString } from "formik";
import { ClientSettingTypeModifiers } from "api/settings";

export type SettingValue = boolean | number | Date | string;

export function toValue(type: SettingType, valueString: string): SettingValue;
export function toValue(type: SettingType, valueString: null | undefined): null;
export function toValue(type: SettingType, valueString: string | null | undefined): SettingValue | null;
export function toValue(type: SettingType, valueString: string | null | undefined): SettingValue | null {
    if (valueString == null) {
        return null;
    }
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

function deserializeInt(value: string | number): number {
    return isNumber(value) ? value : parseInt(value);
}

export function validate(value: SettingValue, type: SettingType,
                         modifiers: SettingTypeModifiers | ClientSettingTypeModifiers | null | undefined): true | string {
    if (!modifiers) {
        return true;
    }

    switch (type) {
        case "int":
            if (!isNumber(value)) {
                return "The value must be number";
            }
            if (modifiers.min && value < deserializeInt(modifiers.min)) {
                return "The value must be not less than " + modifiers.min;
            }
            if (modifiers.max && value > deserializeInt(modifiers.max)) {
                return "The value must be not more than " + modifiers.max;
            }
            return true;

        case "Duration": {
            if (!isString(value)) {
                return "The value must be string";
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

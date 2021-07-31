import { isNumber } from "util/misc";

export type FixedUnit = "s" | "m" | "h" | "d";
export type DurationUnit = "never" | "always" | FixedUnit;

const UNIT_FACTORS: Record<FixedUnit, number> = {
    "s": 1,
    "m": 60,
    "h": 60 * 60,
    "d": 24 * 60 * 60
};

export function isFixedUnit(unit: DurationUnit): unit is FixedUnit {
    return unit !== "never" && unit !== "always";
}

export class DurationParsingError extends Error {

    constructor(value: string) {
        super("Error parsing duration value: " + value);
    }

}

export class DurationZoneError extends Error {

    constructor(value: DurationUnit) {
        super("Error converting duration value '" + value + "' to seconds");
    }

}

export class Duration {

    static MIN = new Duration(0, "s");
    static MAX = new Duration(Number.MAX_SAFE_INTEGER, "s");

    amount: number;
    unit: DurationUnit;

    constructor(amount: number, unit: DurationUnit) {
        this.amount = amount;
        this.unit = unit;
    }

    static parse(v: string | number | null | undefined): Duration {
        if (v == null) {
            return new Duration(0, "s");
        }
        if (isNumber(v)) {
            return new Duration(v, "s");
        }
        if (v.length === 0) {
            return new Duration(0, "s");
        }
        if (v === "never" || v === "always") {
            return new Duration(0, v);
        }
        if (!/^[0-9]+[smhd]$/i.test(v)) {
            throw new DurationParsingError(v);
        }
        return new Duration(
            parseInt(v.substring(0, v.length - 1)),
            v.charAt(v.length - 1).toLowerCase() as DurationUnit
        )
    }

    isNever(): boolean {
        return this.unit === "never";
    }

    isAlways(): boolean {
        return this.unit === "always";
    }

    isFixed(): boolean {
        return isFixedUnit(this.unit);
    }

    toSeconds(): number {
        if (!isFixedUnit(this.unit)) {
            throw new DurationZoneError(this.unit);
        }
        return this.amount * UNIT_FACTORS[this.unit];
    }

    toUnitCeil(unit: FixedUnit): number | null {
        return this.isFixed() ? Math.ceil(this.toSeconds() / UNIT_FACTORS[unit]) : null;
    }

    toUnitFloor(unit: FixedUnit): number | null {
        return this.isFixed() ? Math.floor(this.toSeconds() / UNIT_FACTORS[unit]) : null;
    }

    toString(): string {
        return this.isFixed() ? `${this.amount}${this.unit}` : this.unit;
    }

}

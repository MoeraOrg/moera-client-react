type Unit = "never" | "always" | "s" | "m" | "h" | "d";

const UNIT_FACTORS: Record<Unit, number> = {
    "never": 1,
    "always": 1,
    "s": 1,
    "m": 60,
    "h": 60 * 60,
    "d": 24 * 60 * 60
};

export class DurationParsingError extends Error {

    constructor(value: string) {
        super("Error parsing duration value: " + value);
    }

}

export class DurationZoneError extends Error {

    constructor(value: Unit) {
        super("Error converting duration value '" + value + "' to seconds");
    }

}

export default class Duration {

    static MIN = new Duration(0, "s");
    static MAX = new Duration(Number.MAX_SAFE_INTEGER, "s");

    amount: number;
    unit: Unit;

    constructor(amount: number, unit: Unit) {
        this.amount = amount;
        this.unit = unit;
    }

    static parse(v: string): Duration {
        if (v == null || v.length === 0) {
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
            v.charAt(v.length - 1).toLowerCase() as Unit
        )
    }

    isNever(): boolean {
        return this.unit === "never";
    }

    isAlways(): boolean {
        return this.unit === "always";
    }

    isFixed(): boolean {
        return !this.isNever() && !this.isAlways();
    }

    toSeconds(): number {
        if (!this.isFixed()) {
            throw new DurationZoneError(this.unit);
        }
        return this.amount * UNIT_FACTORS[this.unit];
    }

    toUnitCeil(unit: Unit): number | null {
        return this.isFixed() ? Math.ceil(this.toSeconds() / UNIT_FACTORS[unit]) : null;
    }

    toUnitFloor(unit: Unit): number | null {
        return this.isFixed() ? Math.floor(this.toSeconds() / UNIT_FACTORS[unit]) : null;
    }

    toString(): string {
        return this.isFixed() ? `${this.amount}${this.unit}` : this.unit;
    }

}

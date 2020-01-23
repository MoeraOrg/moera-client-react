const UNIT_FACTORS = {
    "s": 1,
    "m": 60,
    "h": 60 * 60,
    "d": 24 * 60 * 60
};

export class DurationParsingError extends Error {

    constructor(value) {
        super("Error parsing duration value: " + value);
    }

}

export default class Duration {

    static MIN = new Duration(0, "s");
    static MAX = new Duration(Number.MAX_SAFE_INTEGER, "s");

    constructor(amount, unit) {
        this.amount = amount;
        this.unit = unit;
    }

    static parse(v) {
        if (v == null || v.length === 0) {
            return new Duration(0, "s");
        }
        if (!/^[0-9]+[smhd]$/i.test(v)) {
            throw new DurationParsingError(v);
        }
        return new Duration(
            parseInt(v.substring(0, v.length - 1)),
            v.charAt(v.length - 1).toLowerCase()
        )
    }

    toSeconds() {
        return this.amount * UNIT_FACTORS[this.unit];
    }

    toUnitCeil(unit) {
        return Math.ceil(this.toSeconds() / UNIT_FACTORS[unit]);
    }

    toUnitFloor(unit) {
        return Math.floor(this.toSeconds() / UNIT_FACTORS[unit]);
    }

    toString() {
        return `${this.amount}${this.unit}`;
    }

}
